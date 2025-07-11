import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Conseillers from './pages/Conseillers';
import AjouterConseiller from './pages/AjouterConseiller';
import ModifierConseiller from './pages/ModifierConseiller';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import Tasks from './pages/Tasks';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import Users from './pages/Users';
import AjouterUtilisateur from './pages/AjouterUtilisateur';
import ModifierUtilisateur from './pages/ModifierUtilisateur';
import ListeProprietaires from './pages/ListeProprietaires';
import AjouterProprietaire from './pages/AjouterProprietaire';
import DetailProprietaire from './pages/DetailProprietaire';
import ModifierProprietaire from './pages/ModifierProprietaire';

const queryClient = new QueryClient();

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading indicator
  }

  if (!user) {
    // Redirect to the login page if not authenticated
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
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
                path="/conseillers"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Conseillers />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conseiller/ajouter"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AjouterConseiller />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conseiller/:id/modifier"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ModifierConseiller />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/properties"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Properties />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/property/add"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AddProperty />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/property/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EditProperty />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Tasks />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/task/add"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AddTask />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/task/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EditTask />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Roles />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/permissions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Permissions />
                    </Layout>
                  </ProtectedRoute>
                }
              />
               <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Users />
                    </Layout>
                  </ProtectedRoute>
                }
              />
                <Route
                path="/utilisateur/ajouter"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AjouterUtilisateur />
                    </Layout>
                  </ProtectedRoute>
                }
              />
                <Route
                path="/utilisateur/:id/modifier"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ModifierUtilisateur />
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
