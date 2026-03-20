import { db } from "../../common/config/db.js";
import { registrations, athletes, events } from "../../common/database/schema/index.js";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { LoggerInstance } from "../../common/logging/logger.js";

const Logger = new LoggerInstance({ serviceName: "RegistrationsService", filePath: "backend/src/modules/registrations/registrations.service.ts" });

/**
 * Service to handle Registration data and related joins using Drizzle ORM.
 */
export class RegistrationsService {
  /**
   * Retrieves registrations with joined athlete and event data.
   */
  async getAll(query: any = {}) {
    try {
      const filters: any[] = [];
      if (query.startDate) filters.push(gte(registrations.createdAt, new Date(query.startDate)));
      if (query.endDate) filters.push(lte(registrations.createdAt, new Date(query.endDate)));

      const results = await db
        .select({
          id: registrations.id,
          createdAt: registrations.createdAt,
          athlete: {
            name: athletes.name,
            college: athletes.college,
            email: athletes.email
          },
          event: {
            name: events.name,
            category: events.category,
            date: events.date
          }
        })
        .from(registrations)
        .innerJoin(athletes, eq(registrations.athleteId, athletes.id))
        .innerJoin(events, eq(registrations.eventId, events.id))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(registrations.createdAt));

      return results;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Creates a new registration record.
   */
  async create(regData: any) {
    try {
      const [newReg] = await db
        .insert(registrations)
        .values({
          athleteId: Number(regData.athlete_id),
          eventId: Number(regData.event_id),
          status: regData.status || "confirmed"
        })
        .returning();
      Logger.success(`Registration created (ID: ${newReg.id})`);
      return newReg;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Deletes a registration record by ID.
   */
  async delete(id: string) {
    try {
      await db.delete(registrations).where(eq(registrations.id, Number(id)));
      Logger.success(`Registration deleted (ID: ${id})`);
      return { message: "Cancelled" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const registrationsService = new RegistrationsService();
