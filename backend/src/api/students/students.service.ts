import { db } from "../../common/config/db.js";
import { students, houses, users } from "../../common/database/schema/index.js";
import { eq, desc } from "drizzle-orm";
import { LoggerInstance } from "../../common/logging/logger.js";
import * as xlsx from "xlsx";

const Logger = new LoggerInstance({ serviceName: "StudentsService", filePath: "backend/src/api/students/students.service.ts" });

export class StudentsService {
  async importFromExcel(fileBuffer: Buffer) {
    try {
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let rawStudents: any[] = xlsx.utils.sheet_to_json(sheet);

      // Sort students based on roll number, fallback to name
      rawStudents.sort((a, b) => {
        const rollA = a.rollNumber || a["Roll Number"] || "";
        const rollB = b.rollNumber || b["Roll Number"] || "";
        const nameA = a.name || a["Name"] || "";
        const nameB = b.name || b["Name"] || "";
        
        if (rollA && rollB) return String(rollA).localeCompare(String(rollB));
        if (rollA) return -1;
        if (rollB) return 1;
        return String(nameA).localeCompare(String(nameB));
      });

      // Fetch houses
      const existingHouses = await db.select().from(houses).orderBy(houses.name);
      if (existingHouses.length === 0) {
        throw new Error("No houses found. Please create the 8 houses first.");
      }

      const assignedStudents = rawStudents.map((s, index) => {
        const house = existingHouses[index % existingHouses.length];
        return {
          name: String(s.name || s["Name"] || "Unknown"),
          registerNumber: String(s.registerNumber || s["Register Number"] || `REG-${Date.now()}-${index}`),
          phone: s.phone || s["Phone"] || null,
          rollNumber: s.rollNumber || s["Roll Number"] || null,
          className: s.className || s["Class"] || null,
          degree: s.degree || s["Degree"] || null,
          department: s.department || s["Department"] || null,
          year: String(s.year || s["Year"] || ""),
          address: s.address || s["Address"] || null,
          houseId: house.id
        };
      });

      // Perform bulk insert
      await db.insert(students).values(assignedStudents);
      
      Logger.info(`Successfully imported ${assignedStudents.length} students.`);
      return { message: `Imported ${assignedStudents.length} students successfully.`, count: assignedStudents.length };
    } catch (error: any) {
      Logger.error(`Error importing students: ${error.message}`);
      throw new Error(`Failed to import students: ${error.message}`);
    }
  }

  async getAll() {
    try {
      return await db.select().from(students).orderBy(desc(students.createdAt));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getTemplate() {
    try {
      const worksheet = xlsx.utils.json_to_sheet([
        {
          "Name": "John Doe",
          "Register Number": "REG001",
          "Roll Number": "1",
          "Phone": "9876543210",
          "Class": "CSE-A",
          "Degree": "B.E",
          "Department": "Computer Science",
          "Year": "III",
          "Address": "123 Main St, City"
        }
      ]);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Students");
      const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
      return buffer;
    } catch (error: any) {
      throw new Error(`Failed to generate template: ${error.message}`);
    }
  }
}

export const studentsService = new StudentsService();
