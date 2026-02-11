import { useState, useCallback, useEffect } from "react";
import { Upload, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { analyzeResume } from "@/lib/groq";
import { parsePDF } from "@/lib/pdfParser";
import { useToast } from "@/hooks/use-toast";
import { useDatabase } from "@/hooks/use-database";
import { useLocation } from "react-router-dom";

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [analyzed, setAnalyzed] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const { toast } = useToast();
  const { saveResume } = useDatabase();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.resume) {
      const { resume } = location.state;
      setAnalysis(resume.analysis);
      setAnalyzed(true);
      setDialogOpen(false);
      // We cannot recreate the file or file URL, so we keep file=null and pdfUrl=""
      // The UI handles pdfUrl="" by showing a placeholder.
    }
  }, [location.state]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setPdfUrl(URL.createObjectURL(droppedFile));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPdfUrl(URL.createObjectURL(selected));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setDialogOpen(false);
    setAnalyzed(true);

    try {
      const text = await parsePDF(file);
      const result = await analyzeResume(text);
      setAnalysis(result);
      await saveResume(file.name, result, result.overallScore);
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({ title: "Error", description: error.message || "Failed to analyze resume", variant: "destructive" });
      setAnalyzed(false);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (analyzed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI Analysis Results</h2>
          <Button variant="outline" onClick={() => { setAnalyzed(false); setFile(null); setPdfUrl(""); setAnalysis(null); setDialogOpen(true); }}>
            <RefreshCw className="mr-2 h-4 w-4" /> Re-analyze
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto text-brand" />
            <p className="mt-4 text-muted-foreground">Analyzing your resume...</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div className="gradient-banner rounded-xl p-6 text-brand-foreground">
                <p className="text-sm font-medium opacity-90">Overall Score</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{analysis?.overallScore || 65}</span>
                  <span className="text-lg opacity-80">/100</span>
                  <span className="ml-auto text-sm font-semibold text-amber-200">
                    {(analysis?.overallScore || 65) >= 80 ? "Excellent" : (analysis?.overallScore || 65) >= 60 ? "Good" : "Needs Improvement"}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-brand-foreground/20">
                  <div className="h-full rounded-full bg-brand-foreground" style={{ width: `${analysis?.overallScore || 65}%` }} />
                </div>
                <p className="mt-3 text-xs opacity-80">{analysis?.summary || "Analysis complete"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Contact Info", score: analysis?.categories?.contactInfo?.score || 75, text: analysis?.categories?.contactInfo?.feedback || "Contact information is implied but not explicitly stated." },
                  { label: "Experience", score: analysis?.categories?.experience?.score || 70, text: analysis?.categories?.experience?.feedback || "Highlights years of experience but lacks achievement details." },
                  { label: "Education", score: analysis?.categories?.education?.score || 60, text: analysis?.categories?.education?.feedback || "Education section needs more structure and details." },
                  { label: "Skills", score: analysis?.categories?.skills?.score || 80, text: analysis?.categories?.skills?.feedback || "Good range of technical skills listed." },
                ].map((cat) => (
                  <div key={cat.label} className="rounded-xl border bg-card p-4">
                    <h4 className="text-sm font-medium">{cat.label}</h4>
                    <p className="mt-1 text-2xl font-bold text-amber-500">{cat.score}%</p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{cat.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-4 text-lg font-bold">Resume Preview</h3>
              {pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-[600px] rounded-lg border" />
              ) : (
                <div className="rounded-lg border p-6 text-sm text-muted-foreground text-center">
                  <p className="italic">Resume preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold">AI Resume Analyzer</h2>
        <p className="text-muted-foreground mt-1">Upload your resume to get AI-powered analysis</p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload resume pdf file</DialogTitle>
          </DialogHeader>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 transition-colors hover:border-brand"
          >
            {file ? (
              <>
                <FileText className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-brand">{file.name}</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAnalyze} disabled={!file || loading}>
              <RefreshCw className="mr-2 h-4 w-4" /> {loading ? "Analyzing..." : "Upload & Analyze"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
