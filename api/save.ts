import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { chats, resumes, roadmaps, coverLetters } from "../../src/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, data } = req.body;

  try {
    switch (type) {
      case 'chat':
        await db.insert(chats).values(data);
        break;
      case 'resume':
        await db.insert(resumes).values(data);
        break;
      case 'roadmap':
        await db.insert(roadmaps).values(data);
        break;
      case 'coverLetter':
        await db.insert(coverLetters).values(data);
        break;
    }
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
