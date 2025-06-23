// src/types.ts

export type Application = {
  id: number;
  company: string;
  jobTitle: string;
  dateApplied: string; // ISO string format
  status: string;
  notes: string; // Now mandatory
  followUpDate?: string; // ISO string format
  jobUrl: string; // Now mandatory
  createdAt: string; // Added createdAt as it's in Prisma schema
};
