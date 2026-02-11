import { useHistory } from "@/hooks/use-database";
import { MessageSquare, FileText, Map, FileEdit, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const { data: history, isLoading } = useHistory();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!history) return <div>No history found.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My History</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-brand" />
            <h3 className="font-semibold">AI Chats</h3>
            <span className="ml-auto text-sm text-muted-foreground">{history.chats?.length || 0}</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-auto">
            {history.chats?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No chats yet</p>
            ) : (
              history.chats?.slice(0, 5).map((chat: any) => (
                <div
                  key={chat.id}
                  className="text-sm p-2 rounded bg-accent cursor-pointer hover:bg-accent/80 transition-colors"
                  onClick={() => navigate("/dashboard/ai-tools/qa-chat", { state: { chat } })}
                >
                  <p className="font-medium truncate">{chat.message}</p>
                  <p className="text-xs text-muted-foreground">{new Date(chat.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-brand" />
            <h3 className="font-semibold">Resume Analysis</h3>
            <span className="ml-auto text-sm text-muted-foreground">{history.resumes?.length || 0}</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-auto">
            {history.resumes?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resumes analyzed yet</p>
            ) : (
              history.resumes?.slice(0, 5).map((resume: any) => (
                <div
                  key={resume.id}
                  className="text-sm p-2 rounded bg-accent cursor-pointer hover:bg-accent/80 transition-colors"
                  onClick={() => navigate("/dashboard/ai-tools/resume-analyzer", { state: { resume } })}
                >
                  <p className="font-medium truncate">{resume.fileName}</p>
                  <p className="text-xs text-muted-foreground">Score: {resume.score}% - {new Date(resume.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Map className="h-5 w-5 text-brand" />
            <h3 className="font-semibold">Roadmaps</h3>
            <span className="ml-auto text-sm text-muted-foreground">{history.roadmaps?.length || 0}</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-auto">
            {history.roadmaps?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roadmaps generated yet</p>
            ) : (
              history.roadmaps?.slice(0, 5).map((roadmap: any) => (
                <div
                  key={roadmap.id}
                  className="text-sm p-2 rounded bg-accent cursor-pointer hover:bg-accent/80 transition-colors"
                  onClick={() => navigate("/dashboard/ai-tools/roadmap", { state: { roadmap } })}
                >
                  <p className="font-medium truncate">{roadmap.position}</p>
                  <p className="text-xs text-muted-foreground">{new Date(roadmap.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileEdit className="h-5 w-5 text-brand" />
            <h3 className="font-semibold">Cover Letters</h3>
            <span className="ml-auto text-sm text-muted-foreground">{history.coverLetters?.length || 0}</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-auto">
            {history.coverLetters?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No cover letters generated yet</p>
            ) : (
              history.coverLetters?.slice(0, 5).map((letter: any) => (
                <div
                  key={letter.id}
                  className="text-sm p-2 rounded bg-accent cursor-pointer hover:bg-accent/80 transition-colors"
                  onClick={() => navigate("/dashboard/ai-tools/cover-letter", { state: { letter } })}
                >
                  <p className="font-medium truncate">{letter.jobTitle} at {letter.company}</p>
                  <p className="text-xs text-muted-foreground">{new Date(letter.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
