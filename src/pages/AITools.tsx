import { MessageSquare, FileText, Map, FileEdit } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tools = [
  {
    title: "AI Career Q&A Chat",
    description: "Ask career questions and get tailored advice from our AI agent.",
    icon: MessageSquare,
    action: "Ask Now",
    url: "/dashboard/ai-tools/qa-chat",
  },
  {
    title: "AI Resume Analyzer",
    description: "Upload your resume and get AI-powered analysis with improvement tips.",
    icon: FileText,
    action: "Analyze Now",
    url: "/dashboard/ai-tools/resume-analyzer",
  },
  {
    title: "Career Roadmap Generator",
    description: "Generate a visual career roadmap based on your target role.",
    icon: Map,
    action: "Generate Now",
    url: "/dashboard/ai-tools/roadmap",
  },
  {
    title: "Cover Letter Generator",
    description: "Create personalized cover letters powered by AI.",
    icon: FileEdit,
    action: "Create Now",
    url: "/dashboard/ai-tools/cover-letter",
  },
];

export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Tools</h2>
        <p className="mt-1 text-muted-foreground">Select an AI tool to get started</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="flex flex-col justify-between rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-brand/10">
                <tool.icon className="h-7 w-7 text-brand" />
              </div>
              <h3 className="text-lg font-semibold">{tool.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
            </div>
            <Button className="mt-5" asChild>
              <Link to={tool.url}>{tool.action}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
