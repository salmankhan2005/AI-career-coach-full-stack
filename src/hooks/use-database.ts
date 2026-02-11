import { useAuth } from "@/contexts/AuthContext";
import { db } from "../db";
import { chats, resumes, roadmaps, coverLetters, users } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUser() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const userData = await db.select().from(users).where(eq(users.firebaseUid, user.uid));
      return userData[0] || null;
    },
    enabled: !!user?.uid
  });
}

export function useHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["history", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return { chats: [], resumes: [], roadmaps: [], coverLetters: [] };

      const [userChats, userResumes, userRoadmaps, userCoverLetters] = await Promise.all([
        db.select().from(chats).where(eq(chats.userId, user.uid)).orderBy(desc(chats.createdAt)),
        db.select().from(resumes).where(eq(resumes.userId, user.uid)).orderBy(desc(resumes.createdAt)),
        db.select().from(roadmaps).where(eq(roadmaps.userId, user.uid)).orderBy(desc(roadmaps.createdAt)),
        db.select().from(coverLetters).where(eq(coverLetters.userId, user.uid)).orderBy(desc(coverLetters.createdAt)),
      ]);

      return {
        chats: userChats,
        resumes: userResumes,
        roadmaps: userRoadmaps,
        coverLetters: userCoverLetters,
      };
    },
    enabled: !!user?.uid,
  });
}

export function useDatabase() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async ({ displayName }: { displayName: string }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      await db.update(users).set({ displayName }).where(eq(users.firebaseUid, user.uid));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
    }
  });

  const upgradePlanMutation = useMutation({
    mutationFn: async () => {
      if (!user?.uid) throw new Error("User not authenticated");
      await db.update(users).set({ subscriptionPlan: "Pro", credits: 100 }).where(eq(users.firebaseUid, user.uid));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
    }
  });

  const saveChatMutation = useMutation({
    mutationFn: async ({ message, response }: { message: string; response: string }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      await db.insert(chats).values({
        userId: user.uid,
        message,
        response,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history", user?.uid] });
    },
  });

  const saveResumeMutation = useMutation({
    mutationFn: async ({ fileName, analysis, score }: { fileName: string; analysis: any; score: number }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      await db.insert(resumes).values({
        userId: user.uid,
        fileName,
        analysis,
        score,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history", user?.uid] });
    },
  });

  const saveRoadmapMutation = useMutation({
    mutationFn: async ({ position, nodes, edges, type }: { position: string; nodes: any; edges: any; type: string }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      await db.insert(roadmaps).values({
        userId: user.uid,
        position,
        nodes,
        edges,
        type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history", user?.uid] });
    },
  });

  const saveCoverLetterMutation = useMutation({
    mutationFn: async ({ jobTitle, company, content }: { jobTitle: string; company: string; content: string }) => {
      console.log("Saving cover letter:", { jobTitle, company });
      if (!user?.uid) throw new Error("User not authenticated");
      const result = await db.insert(coverLetters).values({
        userId: user.uid,
        jobTitle,
        company,
        content,
      }).returning();
      console.log("Cover letter saved:", result);
      return result;
    },
    onSuccess: () => {
      console.log("Invalidating history query for user:", user?.uid);
      queryClient.invalidateQueries({ queryKey: ["history", user?.uid] });
    },
    onError: (error) => {
      console.error("Error saving cover letter:", error);
    }
  });

  return {
    user,
    updateProfile: (displayName: string) => updateProfileMutation.mutateAsync({ displayName }),
    upgradePlan: () => upgradePlanMutation.mutateAsync(),
    saveChat: (message: string, response: string) => saveChatMutation.mutateAsync({ message, response }),
    saveResume: (fileName: string, analysis: any, score: number) => saveResumeMutation.mutateAsync({ fileName, analysis, score }),
    saveRoadmap: (position: string, data: { nodes: any, edges: any, type: string }) => saveRoadmapMutation.mutateAsync({ position, ...data }),
    saveCoverLetter: (jobTitle: string, company: string, content: string) => saveCoverLetterMutation.mutateAsync({ jobTitle, company, content }),
    getHistory: async () => {
      return { chats: [], resumes: [], roadmaps: [], coverLetters: [] };
    }
  };
}
