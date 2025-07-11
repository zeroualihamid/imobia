
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ListeProprietaires from './pages/ListeProprietaires';
import AjouterProprietaire from './pages/AjouterProprietaire';
import DetailProprietaire from './pages/DetailProprietaire';
import ModifierProprietaire from './pages/ModifierProprietaire';

const queryClient = new QueryClient();

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <LanguageProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proprietaires"
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
                path="/proprietaire/:id/modifier"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ModifierProprietaire />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
