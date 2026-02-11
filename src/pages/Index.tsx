import { Link } from "react-router-dom";
import { Bot, ChevronRight, MessageSquare, FileText, Map, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { title: "AI Career Chat Q&A", icon: MessageSquare },
  { title: "AI Resume Analyzer", icon: FileText },
  { title: "AI Roadmap Generator", icon: Map },
  { title: "AI Cover Letter Generator", icon: FileEdit },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-brand" />
          <div>
            <span className="text-lg font-bold">AI CAREER</span>
            <span className="ml-1 text-xs text-muted-foreground">COACH AGENT</span>
          </div>
        </div>
        <Button asChild>
          <Link to="/auth">Get Started</Link>
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Hexagon background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L52 17.5 L52 42.5 L30 55 L8 42.5 L8 17.5 Z' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
            🚀 Join Our AI Career Community <ChevronRight className="h-4 w-4" />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Land Your Dream Job{" "}
            <br />
            with the{" "}
            <span className="text-brand">AI Career Coach</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Personalized job search, resume tips, mock interviews, and AI guidance for every career level.
          </p>

          <Button size="lg" className="mt-8" asChild>
            <Link to="/auth">
              Start Coaching <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
