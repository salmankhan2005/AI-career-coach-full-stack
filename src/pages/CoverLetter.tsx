import { useState, useEffect } from "react";
import { FileEdit, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/lib/groq";
import { useToast } from "@/hooks/use-toast";
import { useDatabase } from "@/hooks/use-database";
import { useLocation } from "react-router-dom";

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [generated, setGenerated] = useState(false);
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { saveCoverLetter } = useDatabase();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.letter) {
      const { letter: savedLetter } = location.state;
      setJobTitle(savedLetter.jobTitle);
      setCompany(savedLetter.company);
      setLetter(savedLetter.content);
      setGenerated(true);
    }
  }, [location.state]);

  const handleGenerate = async () => {
    if (!jobTitle.trim()) return;
    setLoading(true);
    try {
      const result = await generateCoverLetter(jobTitle, company);
      setLetter(result);
      setGenerated(true);
      await saveCoverLetter(jobTitle, company, result);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([letter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${company.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Cover Letter Generator</h2>
        <p className="text-muted-foreground mt-1">Generate a personalized cover letter with AI</p>
      </div>

      {!generated ? (
        <div className="max-w-lg space-y-4 rounded-xl border bg-card p-6">
          <div>
            <label className="text-sm font-medium">Job Title</label>
            <Input
              placeholder="e.g. Senior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <Input
              placeholder="e.g. Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleGenerate} disabled={!jobTitle.trim() || loading}>
            <FileEdit className="mr-2 h-4 w-4" /> {loading ? "Generating..." : "Generate Cover Letter"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(letter)}>
              <Copy className="mr-1 h-4 w-4" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-1 h-4 w-4" /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => setGenerated(false)}>
              Create Another
            </Button>
          </div>
          <Textarea
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
