import { desc, eq } from "drizzle-orm";

import { database } from "../";
import { SelectUsers, users } from "../schemas";

interface UpdateUserData {
  answersCorrect: number;
  answersIncorrect: number;
}

export class UserRespository {
  static async updateUser(id: string, data: UpdateUserData) {
    const user = await UserRespository.getUser(id);

    await database
      .insert(users)
      .values({
        id,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          answersCorrect: user.answersCorrect + data.answersCorrect,
          answersIncorrect: user.answersIncorrect + data.answersIncorrect,
        },
      });
  }

  static async getUser(id: string, _create = false): Promise<SelectUsers> {
    const [user] = await database.select().from(users).where(eq(users.id, id));

    if (!user)
      return {
        id,
        answersCorrect: 0,
        answersIncorrect: 0,
      };

    return user;
  }

  static getTop() {
    return database.select().from(users).orderBy(desc(users.answersCorrect)).limit(10);
  }
}
