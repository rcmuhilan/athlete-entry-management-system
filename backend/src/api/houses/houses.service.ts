import { db } from "../../common/config/db.js";
import { houses } from "../../common/database/schema/index.js";
import { eq, desc } from "drizzle-orm";
import { LoggerInstance } from "../../common/logging/logger.js";

const Logger = new LoggerInstance({ serviceName: "HousesService", filePath: "backend/src/api/houses/houses.service.ts" });

export class HousesService {
  async getAll() {
    try {
      return await db.select().from(houses).orderBy(houses.name);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async create(houseData: { name: string; color?: string; points?: number }) {
    try {
      const [newHouse] = await db.insert(houses).values(houseData).returning();
      Logger.info(`House created: ${newHouse.name}`);
      return newHouse;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async update(id: string, houseData: any) {
    try {
      const [updatedHouse] = await db
        .update(houses)
        .set(houseData)
        .where(eq(houses.id, id))
        .returning();
      Logger.info(`House updated (ID: ${id})`);
      return updatedHouse;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async delete(id: string) {
    try {
      await db.delete(houses).where(eq(houses.id, id));
      Logger.info(`House deleted (ID: ${id})`);
      return { message: "Deleted" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const housesService = new HousesService();
