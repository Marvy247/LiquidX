import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/components/WalletProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import LiquidX from "./pages/LiquidX";
import NotFound from "./pages/NotFound";

const App = () => (
  <ErrorBoundary>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors closeButton />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<LiquidX />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </ErrorBoundary>
);

export default App;
