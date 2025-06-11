import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FileText, Calendar, TrendingUp, Home } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Biens',
      value: '156',
      description: '+12% ce mois',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Conseillers Actifs',
      value: '24',
      description: '+2 nouveaux',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Demandes en Cours',
      value: '89',
      description: '+5% cette semaine',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'RDV Planifiés',
      value: '32',
      description: 'Cette semaine',
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Nouveau bien ajouté', property: 'Appartement 3P - Paris 15e', time: 'Il y a 2h' },
    { id: 2, action: 'Demande client', property: 'Recherche studio - Paris 11e', time: 'Il y a 4h' },
    { id: 3, action: 'Visite planifiée', property: 'Maison 5P - Neuilly', time: 'Il y a 1j' },
    { id: 4, action: 'Mandat signé', property: 'Local commercial - Bastille', time: 'Il y a 2j' }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-slate-600">
          Vue d'ensemble de votre activité immobilière
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white hover:shadow-lg transition-all duration-200 border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Activité Récente
            </CardTitle>
            <CardDescription>
              Dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="space-y-1">
                    <p className="font-medium text-sm text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.property}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Biens les plus demandés
            </CardTitle>
            <CardDescription>
              Types de biens recherchés cette semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Appartements 2-3 pièces</span>
                  <span className="text-sm font-semibold text-blue-600">45%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Maisons avec jardin</span>
                  <span className="text-sm font-semibold text-emerald-600">30%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full transition-all duration-300" style={{ width: '30%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Locaux commerciaux</span>
                  <span className="text-sm font-semibold text-purple-600">25%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
