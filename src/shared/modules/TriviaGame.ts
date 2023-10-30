import { setTimeout } from "node:timers/promises";

import {
  ButtonComponent,
  ButtonStyles,
  CommandInteraction,
  ComponentTypes,
} from "oceanic.js";

import { UserRespository } from "@/core/database/repositories/UserRepository";
import { TriviaQuestion } from "@/infra/trivia";

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

interface TriviaGameOptions {
  guildId: string;
  channelId: string;
  interaction: CommandInteraction;
  questions: TriviaQuestion[];
  time: number;
}

interface TriviaGameQuestion extends TriviaQuestion {
  answers: {
    correct: string[];
    incorrect: string[];
  };
}

export class TriviaGame {
  // eslint-disable-next-line no-use-before-define
  public static list: TriviaGame[] = [];

  public guildId: string;
  public channelId: string;
  public messageId: string | null = null;
  public interaction: CommandInteraction;
  public questions: TriviaGameQuestion[];
  public time: number;

  public currentQuestion = -1;
  public questionStartedAt: number | null = null;
  public interval: NodeJS.Timeout | null = null;
  public isRunning = false;

  constructor({ channelId, guildId, interaction, questions, time }: TriviaGameOptions) {
    this.guildId = guildId;
    this.channelId = channelId;
    this.interaction = interaction;
    this.questions = questions.map((q) => ({
      ...q,
      answers: {
        correct: [],
        incorrect: [],
      },
    }));
    this.time = time;

    TriviaGame.list.push(this);
  }

  async start() {
    this.isRunning = true;
    await this.nextQuestion();
    this.interval = setInterval(async () => {
      if (
        this.questionStartedAt &&
        this.questionStartedAt + this.time * 1000 <= Date.now()
      ) {
        if (!this.isRunning) {
          clearInterval(this.interval!);
          return;
        }

        await this.showAnswers();
      }
    }, 1000);
  }

  async end() {
    this.isRunning = false;
    const players = this.getUsers();

    await this.interaction.editOriginal({
      content: [
        "## Trivia Game - Ended",
        `**Total Questions:** ${this.questions.length}`,
        `**Players (${players.length}):**`,
        players
          .map(
            (p) =>
              `<@!${p.id}> **Questions answered (\`${p.answers}\`):** **\`${
                p.correct
              }\`** correct | **\`${p.answers - p.correct}\`** incorrect`,
          )
          .join("\n"),
      ].join("\n"),
      components: [],
    });

    players.forEach(async (p) => {
      await UserRespository.updateUser(p.id, {
        answersCorrect: p.correct,
        answersIncorrect: p.answers - p.correct,
      });
    });
  }

  isAnswered(userId: string) {
    const question = this.questions[this.currentQuestion];

    return (
      question.answers.correct.includes(userId) ||
      question.answers.incorrect.includes(userId)
    );
  }

  answer(userId: string, response: string) {
    const question = this.questions[this.currentQuestion];
    const isCorrect = question.correct_answer === response;

    question.answers[isCorrect ? "correct" : "incorrect"].push(userId);
  }

  async showAnswers() {
    this.questionStartedAt = null;
    const question = this.questions[this.currentQuestion];
    if (!question) return;

    const TOTAL_ANSWERS =
      question.answers.correct.length + question.answers.incorrect.length;

    const answeredCorrectly =
      question.answers.correct.length === 0
        ? "Nobody!"
        : question.answers.correct.map((a) => `<@!${a}>`).join(", ");

    const answeredIncorrectly =
      question.answers.incorrect.length === 0
        ? "Nobody!"
        : question.answers.incorrect.map((a) => `<@!${a}>`).join(", ");

    const original = await this.interaction.getOriginal();

    await this.interaction.editOriginal({
      content: [
        `## ${decodeURIComponent(question.question)}\n`,
        `** **`,
        `**Next question** <t:${~~(Date.now() / 1000 + 5)}:R>`,
        TOTAL_ANSWERS === 0
          ? "**`Nobody answered!`**"
          : [
              `**Answers (${TOTAL_ANSWERS}):**`,
              ` **\`✅ Answered correctly:\`** ${answeredCorrectly}`,
              ` **\`❌ Answered incorrectly:\`** ${answeredIncorrectly}`,
            ].join("\n"),
      ].join("\n"),
      components: [
        {
          components: original.components[0].components.map((c) => {
            if (c.type !== ComponentTypes.BUTTON) return c;

            const isCorrect = c.label === question.correct_answer;
            return {
              ...c,
              type: ComponentTypes.BUTTON,
              disabled: !isCorrect,
              style: isCorrect ? ButtonStyles.SUCCESS : c.style,
            } as ButtonComponent;
          }),
          type: ComponentTypes.ACTION_ROW,
        },
      ],
    });

    await setTimeout(5500);
    await this.nextQuestion();
  }

  async nextQuestion() {
    const question = this.questions[this.currentQuestion + 1];
    if (!question) return this.end();

    // lets add more 1 second (display only)
    const TIME_TO_END = ~~(Date.now() / 1000 + this.time + 1);
    const message = await this.interaction.editOriginal({
      content: [
        `## ${decodeURIComponent(question.question)}\n`,
        `** **`,
        `Time to answer: <t:${TIME_TO_END}:R>`,
        `Remaining questions: ${this.questions.length - 1 - this.currentQuestion}`,
      ].join("\n"),
      components: [
        {
          components: this.getQuestionComponents(question),
          type: ComponentTypes.ACTION_ROW,
        },
      ],
    });

    this.currentQuestion++;
    this.messageId = message.id;
    this.questionStartedAt = Date.now();
  }

  getUsers() {
    const players = this.questions.reduce<
      Record<string, { answers: number; correct: number }>
    >((acc, v) => {
      for (const ca of v.answers.correct) {
        acc[ca] = {
          answers: (acc[ca]?.answers ?? 0) + 1,
          correct: (acc[ca]?.correct ?? 0) + 1,
        };
      }

      for (const ca of v.answers.incorrect) {
        acc[ca] = {
          answers: (acc[ca]?.answers ?? 0) + 1,
          correct: acc[ca]?.correct ?? 0,
        };
      }

      return acc;
    }, {});

    return Object.keys(players)
      .map((id) => {
        return {
          id,
          answers: players[id].answers,
          correct: players[id].correct,
        };
      })
      .sort((a, b) => b.correct - a.correct);
  }

  getQuestionComponents(question: TriviaQuestion, showAnswer = false) {
    const answers: string[] = shuffle([
      question.correct_answer,
      ...question.incorrect_answers,
    ]);

    const components: ButtonComponent[] = answers.map((answer, i) => {
      return {
        customID: `trivia-answer:${(this.currentQuestion + 1) * 10 + i}`,
        label: decodeURIComponent(answer),
        disabled: showAnswer
          ? !(showAnswer && question.correct_answer === answer)
          : false,
        style:
          showAnswer && question.correct_answer === answer
            ? ButtonStyles.SUCCESS
            : ButtonStyles.PRIMARY,
        type: ComponentTypes.BUTTON,
      };
    });

    return components;
  }
}
