import { db } from "../../common/config/db.js";
import { events } from "../../common/database/schema/index.js";
import { eq, asc, ilike, and, gte, lte } from "drizzle-orm";
import { LoggerInstance } from "../../common/logging/logger.js";

const Logger = new LoggerInstance({ serviceName: "EventsService", filePath: "backend/src/modules/events/events.service.ts" });

/**
 * Service to handle Event-related data operations using Drizzle ORM.
 */
export class EventsService {
  /**
   * Retrieves events based on query parameters (search, category, date range).
   */
  async getAll(query: any = {}) {
    try {
      const filters: any[] = [];
      if (query.name) filters.push(ilike(events.name, `%${query.name}%`));
      if (query.category) filters.push(eq(events.category, query.category));
      if (query.startDate) filters.push(gte(events.date, query.startDate));
      if (query.endDate) filters.push(lte(events.date, query.endDate));

      return await db
        .select()
        .from(events)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(asc(events.date));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Creates a new event record.
   */
  async create(eventData: any) {
    try {
      const [newEvent] = await db
        .insert(events)
        .values(eventData)
        .returning();
      Logger.success(`Event created: ${newEvent.name}`);
      return newEvent;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Updates an existing event record.
   */
  async update(id: string, eventData: any) {
    try {
      const [updatedEvent] = await db
        .update(events)
        .set(eventData)
        .where(eq(events.id, Number(id)))
        .returning();
      Logger.success(`Event updated (ID: ${id})`);
      return updatedEvent;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Deletes an event record by ID.
   */
  async delete(id: string) {
    try {
      await db.delete(events).where(eq(events.id, Number(id)));
      Logger.success(`Event deleted (ID: ${id})`);
      return { message: "Deleted" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export const eventsService = new EventsService();
