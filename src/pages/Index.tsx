import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // User is authenticated, redirect to dashboard
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-slate-900">
            Bienvenue sur IMOBIA
          </CardTitle>
          <CardDescription className="text-lg text-slate-600">
            Votre plateforme de gestion immobilière intelligente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-slate-600">
              Connectez-vous pour accéder à votre tableau de bord
            </p>
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
              size="lg"
            >
              Se connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
