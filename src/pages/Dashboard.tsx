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
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <div className={cn(isRTL && "text-right")}>
            <h1 className="text-2xl font-bold text-slate-800">{t('dashboard.title')}</h1>
            <p className="text-slate-600">{t('dashboard.welcome')}</p>
          </div>
          <UserRoleDisplay />
        </div>
      </div>

      {/* Admin Setup Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionGuard role="Admin" fallback={<InitialAdminSetup />}>
          <div></div>
        </PermissionGuard>
        
        <PermissionGuard role="Admin" fallback={<CreateAdminUser />}>
          <div></div>
        </PermissionGuard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-slate-200">
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('dashboard.totalProperties')}</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className={cn(isRTL && "text-right")}>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-slate-600">+2 {t('dashboard.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('dashboard.activeAdvisors')}</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className={cn(isRTL && "text-right")}>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-slate-600">+1 {t('dashboard.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('dashboard.tasksInProgress')}</CardTitle>
            <CheckSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className={cn(isRTL && "text-right")}>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-slate-600">-3 {t('dashboard.today')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('dashboard.performance')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className={cn(isRTL && "text-right")}>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-slate-600">+5% {t('dashboard.thisMonth')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Building2 className="h-5 w-5 text-blue-500" />
              {t('dashboard.propertyManagement')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className={cn("text-sm text-slate-600", isRTL && "text-right")}>{t('dashboard.managePortfolio')}</p>
            <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
              <Link to="/biens" className="flex-1">
                <Button variant="outline" className="w-full">{t('dashboard.viewProperties')}</Button>
              </Link>
              <Link to="/biens/ajouter" className="flex-1">
                <Button className="w-full">{t('dashboard.add')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Users className="h-5 w-5 text-green-500" />
              {t('dashboard.salesTeam')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className={cn("text-sm text-slate-600", isRTL && "text-right")}>{t('dashboard.manageAdvisors')}</p>
            <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
              <Link to="/conseillers" className="flex-1">
                <Button variant="outline" className="w-full">{t('dashboard.viewTeam')}</Button>
              </Link>
              <Link to="/conseillers/ajouter" className="flex-1">
                <Button className="w-full">{t('dashboard.recruit')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <PermissionGuard role="Admin">
          <Card className="bg-white border border-slate-200">
            <CardHeader>
              <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                <Shield className="h-5 w-5 text-purple-500" />
                {t('dashboard.administration')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className={cn("text-sm text-slate-600", isRTL && "text-right")}>{t('dashboard.manageUsersPermissions')}</p>
              <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                <Link to="/admin/roles" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Settings className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {t('dashboard.rolesPermissions')}
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
          <CardTitle className={cn(isRTL && "text-right")}>{t('dashboard.recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={cn("flex items-center", isRTL ? "space-x-reverse space-x-4 flex-row-reverse" : "space-x-4")}>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className={cn("flex-1", isRTL && "text-right")}>
                <p className="text-sm font-medium">{t('dashboard.newPropertyAdded')}</p>
                <p className="text-xs text-slate-600">Appartement 3 pièces - Casablanca</p>
              </div>
              <span className="text-xs text-slate-500">{t('dashboard.hoursAgo').replace('{hours}', '2')}</span>
            </div>
            <div className={cn("flex items-center", isRTL ? "space-x-reverse space-x-4 flex-row-reverse" : "space-x-4")}>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className={cn("flex-1", isRTL && "text-right")}>
                <p className="text-sm font-medium">{t('dashboard.taskCompleted')}</p>
                <p className="text-xs text-slate-600">Visite client - Villa Rabat</p>
              </div>
              <span className="text-xs text-slate-500">{t('dashboard.hoursAgo').replace('{hours}', '4')}</span>
            </div>
            <div className={cn("flex items-center", isRTL ? "space-x-reverse space-x-4 flex-row-reverse" : "space-x-4")}>
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className={cn("flex-1", isRTL && "text-right")}>
                <p className="text-sm font-medium">{t('dashboard.newAdvisor')}</p>
                <p className="text-xs text-slate-600">Sarah Bennani a rejoint l'équipe</p>
              </div>
              <span className="text-xs text-slate-500">{t('dashboard.yesterday')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
