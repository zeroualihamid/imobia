
import React from 'react';
import RoleManagement from '@/components/rbac/RoleManagement';
import PermissionGuard from '@/components/rbac/PermissionGuard';
import { AlertCircle } from 'lucide-react';

const RoleManagementPage = () => {
  return (
    <PermissionGuard 
      role="Admin"
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Accès refusé</h2>
            <p className="text-slate-600">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </div>
        </div>
      }
    >
      <RoleManagement />
    </PermissionGuard>
  );
};

export default RoleManagementPage;
