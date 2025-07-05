
import React from "react";
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
import TachesConseillers from "./pages/TachesConseillers";
import AjouterConseiller from "./pages/AjouterConseiller";
import ListeConseillers from "./pages/ListeConseillers";
import DetailConseiller from "./pages/DetailConseiller";
import PilotageConseillers from "./pages/PilotageConseillers";
import TaskDetail from "./pages/TaskDetail";
import RoleManagement from "./pages/RoleManagement";
import Auth from "./pages/Auth";
import ListeProprietaires from "./pages/ListeProprietaires";
import AjouterProprietaire from "./pages/AjouterProprietaire";
import ListeClients from "./pages/ListeClients";
import AjouterClient from "./pages/AjouterClient";

const queryClient = new QueryClient();

function App() {
  return (
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
                <Route path="/conseillers" element={
                  <ProtectedRoute>
                    <Layout>
                      <ListeConseillers />
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
                <Route path="/conseillers/ajouter" element={
                  <ProtectedRoute>
                    <Layout>
                      <AjouterConseiller />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/conseillers/taches" element={
                  <ProtectedRoute>
                    <Layout>
                      <TachesConseillers />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/conseillers/pilotage" element={
                  <ProtectedRoute>
                    <Layout>
                      <PilotageConseillers />
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
                <Route path="/tasks/:id/edit" element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskDetail />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/roles" element={
                  <ProtectedRoute>
                    <Layout>
                      <RoleManagement />
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
}

export default App;
