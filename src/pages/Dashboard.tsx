
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Shield,
  Settings
} from 'lucide-react';
import UserRoleDisplay from '@/components/rbac/UserRoleDisplay';
import InitialAdminSetup from '@/components/rbac/InitialAdminSetup';
import CreateAdminUser from '@/components/rbac/CreateAdminUser';
import PermissionGuard from '@/components/rbac/PermissionGuard';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
            <p className="text-slate-600">Bienvenue sur votre interface de gestion immobilière</p>
          </div>
          <UserRoleDisplay />
        </div>
      </div>

      {/* Admin Setup Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionGuard role="Admin" fallback={<InitialAdminSetup />}>
          <div></div>
        </PermissionGuard>
        
        {/* Admin User Creation Tool */}
        <PermissionGuard role="Admin" fallback={<CreateAdminUser />}>
          <div></div>
        </PermissionGuard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Biens</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-slate-600">+2 ce mois</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conseillers Actifs</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-slate-600">+1 ce mois</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches en cours</CardTitle>
            <CheckSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-slate-600">-3 aujourd'hui</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-slate-600">+5% ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              Gestion des Biens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">Gérez votre portefeuille immobilier</p>
            <div className="flex gap-2">
              <Link to="/biens" className="flex-1">
                <Button variant="outline" className="w-full">Voir les biens</Button>
              </Link>
              <Link to="/biens/ajouter" className="flex-1">
                <Button className="w-full">Ajouter</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Équipe Commerciale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">Gérez vos conseillers immobiliers</p>
            <div className="flex gap-2">
              <Link to="/conseillers" className="flex-1">
                <Button variant="outline" className="w-full">Voir l'équipe</Button>
              </Link>
              <Link to="/conseillers/ajouter" className="flex-1">
                <Button className="w-full">Recruter</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <PermissionGuard role="Admin">
          <Card className="bg-white border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                Administration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">Gérez les utilisateurs et permissions</p>
              <div className="flex gap-2">
                <Link to="/admin/roles" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Rôles & Permissions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau bien ajouté</p>
                <p className="text-xs text-slate-600">Appartement 3 pièces - Casablanca</p>
              </div>
              <span className="text-xs text-slate-500">Il y a 2h</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Tâche terminée</p>
                <p className="text-xs text-slate-600">Visite client - Villa Rabat</p>
              </div>
              <span className="text-xs text-slate-500">Il y a 4h</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau conseiller</p>
                <p className="text-xs text-slate-600">Sarah Bennani a rejoint l'équipe</p>
              </div>
              <span className="text-xs text-slate-500">Hier</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
