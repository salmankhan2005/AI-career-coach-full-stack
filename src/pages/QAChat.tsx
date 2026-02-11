import { useState, useEffect } from "react";
import { Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatWithAI } from "@/lib/groq";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useDatabase } from "@/hooks/use-database";
import { useLocation } from "react-router-dom";

const sampleQuestions = [
  "What skills do I need for a data analyst role?",
  "How do I switch careers to UX design?",
];

export default function QAChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { saveChat } = useDatabase();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.chat) {
      const { chat } = location.state;
      setMessages([
        { role: "user", text: chat.message },
        { role: "ai", text: chat.response },
      ]);
    }
  }, [location.state]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    setMessages((prev) => [...prev, { role: "ai", text: "..." }]);

    try {
      const history = messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const response = await chatWithAI(userMessage, history);
      setMessages((prev) => prev.slice(0, -1).concat({ role: "ai", text: response }));
      await saveChat(userMessage, response);
    } catch (error: any) {
      setMessages((prev) => prev.slice(0, -1));
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold">AI Career Q/A Chat</h2>
          <p className="text-sm text-muted-foreground">
            Smarter career decisions start here — get tailored advice, real-time market insights
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setMessages([])}>
          <Plus className="mr-1 h-4 w-4" /> New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <h3 className="text-lg font-semibold">Ask anything to AI career Agent</h3>
            <div className="space-y-3 w-full max-w-lg">
              {sampleQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="w-full rounded-lg border px-4 py-3 text-sm text-center hover:bg-accent transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <div key={i} className="flex gap-3">
                {msg.role === "ai" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-semibold">
                    AI
                  </div>
                )}
                <div
                  className={`flex-1 rounded-lg px-4 py-3 ${msg.role === "user"
                    ? "ml-auto max-w-[80%] bg-primary text-primary-foreground"
                    : "bg-card border shadow-sm"
                    }`}
                >
                  {msg.text === "..." ? (
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    U
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t pt-4">
        <Input
          placeholder="Type here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
          disabled={loading}
        />
        <Button onClick={handleSend} size="icon" disabled={loading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
