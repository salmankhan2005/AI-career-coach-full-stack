import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/Dashboard";
import AIToolsPage from "./pages/AITools";
import QAChatPage from "./pages/QAChat";
import ResumeAnalyzerPage from "./pages/ResumeAnalyzer";
import RoadmapPage from "./pages/Roadmap";
import CoverLetterPage from "./pages/CoverLetter";
import HistoryPage from "./pages/History";
import BillingPage from "./pages/Billing";
import ProfilePage from "./pages/Profile";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="ai-tools" element={<AIToolsPage />} />
              <Route path="ai-tools/qa-chat" element={<QAChatPage />} />
              <Route path="ai-tools/resume-analyzer" element={<ResumeAnalyzerPage />} />
              <Route path="ai-tools/roadmap" element={<RoadmapPage />} />
              <Route path="ai-tools/cover-letter" element={<CoverLetterPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
