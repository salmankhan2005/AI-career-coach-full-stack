import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { chats, resumes, roadmaps, coverLetters } from "../../src/db/schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = req.query;

  try {
    const userChats = await db.select().from(chats).where(eq(chats.userId, userId));
    const userResumes = await db.select().from(resumes).where(eq(resumes.userId, userId));
    const userRoadmaps = await db.select().from(roadmaps).where(eq(roadmaps.userId, userId));
    const userCoverLetters = await db.select().from(coverLetters).where(eq(coverLetters.userId, userId));

    res.status(200).json({
      chats: userChats,
      resumes: userResumes,
      roadmaps: userRoadmaps,
      coverLetters: userCoverLetters,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
