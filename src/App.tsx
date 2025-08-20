
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RealTimeDataProvider } from "@/contexts/RealTimeDataContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import RecommendationDetails from "./pages/RecommendationDetails";
import NotFound from "./pages/NotFound";
import Video from "./pages/Video";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <RealTimeDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/recommendations/:id" element={<RecommendationDetails />} />
              <Route path="/video" element={<Video src="video.mp4"/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RealTimeDataProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
