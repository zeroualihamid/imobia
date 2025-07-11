
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AjouterBien from "./pages/AjouterBien";
import Biens from "./pages/Biens";
import DetailBien from "./pages/DetailBien";
import PropertyDetail from "./pages/PropertyDetail";
import AjouterClient from "./pages/AjouterClient";
import ListeClients from "./pages/ListeClients";
import AjouterConseiller from "./pages/AjouterConseiller";
import ListeConseillers from "./pages/ListeConseillers";
import DetailConseiller from "./pages/DetailConseiller";
import PilotageConseillers from "./pages/PilotageConseillers";
import TachesConseillers from "./pages/TachesConseillers";
import TaskDetail from "./pages/TaskDetail";
import AjouterProprietaire from "./pages/AjouterProprietaire";
import ListeProprietaires from "./pages/ListeProprietaires";
import DetailProprietaire from "./pages/DetailProprietaire";
import CreationVocale from "./pages/CreationVocale";
import RoleManagement from "./pages/RoleManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
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
              <Route path="/biens/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <DetailBien />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/properties/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <PropertyDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Layout>
                    <ListeClients />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients/ajouter" element={
                <ProtectedRoute>
                  <Layout>
                    <AjouterClient />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/conseillers" element={
                <ProtectedRoute>
                  <Layout>
                    <ListeConseillers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/conseillers/ajouter" element={
                <ProtectedRoute>
                  <Layout>
                    <AjouterConseiller />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/conseillers/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <DetailConseiller />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pilotage" element={
                <ProtectedRoute>
                  <Layout>
                    <PilotageConseillers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/taches" element={
                <ProtectedRoute>
                  <Layout>
                    <TachesConseillers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/taches/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <TaskDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/proprietaire" element={
                <ProtectedRoute>
                  <Layout>
                    <ListeProprietaires />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/proprietaire/ajouter" element={
                <ProtectedRoute>
                  <Layout>
                    <AjouterProprietaire />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/proprietaires/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <DetailProprietaire />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/creation-vocale" element={
                <ProtectedRoute>
                  <Layout>
                    <CreationVocale />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/role-management" element={
                <ProtectedRoute>
                  <Layout>
                    <RoleManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
