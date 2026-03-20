import { db } from "../../common/config/db.js";
import { athletes } from "../../common/database/schema/index.js";
import { eq, desc } from "drizzle-orm";
import { LoggerInstance } from "../../common/logging/logger.js";

const Logger = new LoggerInstance({ serviceName: "AthletesService", filePath: "backend/src/modules/athletes/athletes.service.ts" });

/**
 * Service to handle Athlete-related data operations using Drizzle ORM.
 */
export class AthletesService {
  /**
   * Retrieves all athletes ordered by ID (descending).
   */
  async getAll() {
    try {
      return await db.select().from(athletes).orderBy(desc(athletes.id));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Creates a new athlete record.
   */
  async create(athleteData: any, userId: string) {
    try {
      const [newAthlete] = await db
        .insert(athletes)
        .values({ ...athleteData, userId })
        .returning();
      Logger.success(`Athlete record created for: ${newAthlete.name}`);
      return newAthlete;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Updates an existing athlete record.
   */
  async update(id: string, athleteData: any) {
    try {
      const [updatedAthlete] = await db
        .update(athletes)
        .set(athleteData)
        .where(eq(athletes.id, Number(id)))
        .returning();
      Logger.success(`Athlete record updated (ID: ${id})`);
      return updatedAthlete;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Deletes an athlete record by ID.
   */
  async delete(id: string) {
    try {
      await db.delete(athletes).where(eq(athletes.id, Number(id)));
      Logger.success(`Athlete record deleted (ID: ${id})`);
      return { message: "Deleted" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const athletesService = new AthletesService();
