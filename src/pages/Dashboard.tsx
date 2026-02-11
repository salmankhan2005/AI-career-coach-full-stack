import { Link } from "react-router-dom";
import { MessageSquare, FileText, Map, FileEdit, Clock, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-database";

const aiTools = [
  {
    title: "AI Career Q&A Chat",
    description: "Ask career questions",
    icon: MessageSquare,
    action: "Ask Now",
    url: "/dashboard/ai-tools/qa-chat",
  },
  {
    title: "AI Resume Analyzer",
    description: "Improve your resume",
    icon: FileText,
    action: "Analyze Now",
    url: "/dashboard/ai-tools/resume-analyzer",
  },
  {
    title: "Career Roadmap Generator",
    description: "Build your roadmap",
    icon: Map,
    action: "Generate Now",
    url: "/dashboard/ai-tools/roadmap",
  },
  {
    title: "Cover Letter Generator",
    description: "Write a cover letter",
    icon: FileEdit,
    action: "Create Now",
    url: "/dashboard/ai-tools/cover-letter",
  },
];

export default function DashboardPage() {
  const { data: history, isLoading } = useHistory();

  // Aggregate and sort history
  const allHistory = [
    ...(history?.chats?.map((item: any) => ({ ...item, type: "QA Chat", icon: MessageSquare, label: item.message })) || []),
    ...(history?.resumes?.map((item: any) => ({ ...item, type: "Resume Analysis", icon: FileText, label: item.fileName })) || []),
    ...(history?.roadmaps?.map((item: any) => ({ ...item, type: "Roadmap", icon: Map, label: item.position })) || []),
    ...(history?.coverLetters?.map((item: any) => ({ ...item, type: "Cover Letter", icon: FileEdit, label: `${item.jobTitle} at ${item.company}` })) || []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="gradient-banner rounded-xl px-8 py-8 text-brand-foreground">
        <h2 className="text-2xl font-bold">AI Career Coach Agent</h2>
        <p className="mt-2 max-w-2xl text-sm opacity-90">
          Smarter career decisions start here — get tailored advice, real-time market insights, and a roadmap built just for you with the power of AI.
        </p>
        <Button variant="secondary" className="mt-4" asChild>
          <Link to="/dashboard/ai-tools">Let's Get Started</Link>
        </Button>
      </div>

      {/* AI Tools Section */}
      <section>
        <h3 className="text-xl font-bold">Available AI Tools</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start Building and Shape Your Career with this exclusive AI Tools
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {aiTools.map((tool) => (
            <div
              key={tool.title}
              className="flex flex-col justify-between rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10">
                  <tool.icon className="h-6 w-6 text-brand" />
                </div>
                <h4 className="font-semibold">{tool.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
              </div>
              <Button className="mt-4 w-full" asChild>
                <Link to={tool.url}>{tool.action}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Previous History */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Previous History</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Recent activity audit log
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/dashboard/history" className="flex items-center gap-1">View All <ChevronRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-4 rounded-xl border bg-card divide-y">
          {isLoading ? (
            <div className="p-8 flex justify-center text-muted-foreground">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : allHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No history yet. Start using AI tools to see your interactions here.</p>
          ) : (
            allHistory.slice(0, 5).map((item: any) => (
              <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.type}</p>
                  <p className="text-sm text-muted-foreground truncate">{item.label}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <p>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
