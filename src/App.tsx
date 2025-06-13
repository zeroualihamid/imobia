
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Biens from "./pages/Biens";
import AjouterBien from "./pages/AjouterBien";
import PropertyDetail from "./pages/PropertyDetail";
import CreationVocale from "./pages/CreationVocale";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/biens" element={
                <ProtectedRoute>
                  <Layout>
                    <Biens />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/biens/ajouter" element={
                <ProtectedRoute>
                  <Layout>
                    <AjouterBien />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/biens/creation-vocale" element={
                <ProtectedRoute>
                  <Layout>
                    <CreationVocale />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/biens/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <PropertyDetail />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
