import fetch from "node-fetch";

interface FetchTriviaData {
  amount: number;
  category?: string;

  token?: string;
}

export interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface TriviaResponse {
  response_code: number;
  results: TriviaQuestion[];
}

const OPEN_TRIVIA_DB_URL = "https://opentdb.com/api.php";

function decodeResponse(response: TriviaResponse): TriviaResponse {
  const decode64 = (str: string) => Buffer.from(str, "base64").toString("utf-8");

  const results = response.results.map((q) => {
    return {
      question: decode64(q.question),
      category: decode64(q.category),
      type: decode64(q.type),
      difficulty: decode64(q.difficulty),
      correct_answer: decode64(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map((e) => decode64(e)),
    };
  });

  return {
    response_code: response.response_code,
    results,
  };
}

export async function fetchTrivia(data: FetchTriviaData): Promise<TriviaResponse> {
  const query = new URLSearchParams(data as unknown as Record<string, string>);
  query.append("encode", "base64");

  const res = await fetch(OPEN_TRIVIA_DB_URL + `?${query}`).then(
    (res) => res.json() as Promise<TriviaResponse>,
  );

  return decodeResponse(res);
}
