import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import ListeProprietaires from '@/pages/ListeProprietaires';
import AjouterProprietaire from '@/pages/AjouterProprietaire';
import DetailProprietaire from '@/pages/DetailProprietaire';
import Index from '@/pages/Index';
import ListeClients from '@/pages/ListeClients';
import AjouterClient from '@/pages/AjouterClient';
import Biens from '@/pages/Biens';
import AjouterBien from '@/pages/AjouterBien';
import DetailBien from '@/pages/DetailBien';
import ListeConseillers from '@/pages/ListeConseillers';
import AjouterConseiller from '@/pages/AjouterConseiller';
import DetailConseiller from '@/pages/DetailConseiller';
import PilotageConseillers from '@/pages/PilotageConseillers';
import TachesConseillers from '@/pages/TachesConseillers';
import TaskDetail from '@/pages/TaskDetail';
import CreationVocale from '@/pages/CreationVocale';
import PropertyDetail from '@/pages/PropertyDetail';
import MubawabScraper from '@/pages/MubawabScraper';
import RoleManagement from '@/pages/RoleManagement';
import Demandes from '@/pages/Demandes';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <div className="App">
            <Router>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Index />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proprietaire"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ListeProprietaires />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proprietaire/ajouter"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AjouterProprietaire />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proprietaire/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DetailProprietaire />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clients"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ListeClients />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clients/ajouter"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AjouterClient />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/biens"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Biens />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/biens/ajouter"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AjouterBien />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/biens/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DetailBien />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/conseillers"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ListeConseillers />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/conseillers/ajouter"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AjouterConseiller />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/conseillers/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DetailConseiller />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/conseillers/pilotage"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PilotageConseillers />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/taches"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TachesConseillers />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/taches/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TaskDetail />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/creation-vocale"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CreationVocale />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/property/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PropertyDetail />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mubawab-scraper"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <MubawabScraper />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/roles"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <RoleManagement />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/demandes"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Demandes />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/demandes/ajouter"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Demandes />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
