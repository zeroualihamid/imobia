
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRBAC } from '@/hooks/useRBAC';
import { Shield, User } from 'lucide-react';

const UserRoleDisplay = () => {
  const { userRoles, permissions, loading } = useRBAC();

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Mes rôles et permissions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="h-3 w-3 text-slate-500" />
            <span className="text-xs font-medium text-slate-600">Rôles :</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {userRoles.length > 0 ? (
              userRoles.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-500">Aucun rôle attribué</span>
            )}
          </div>
        </div>
        
        <div>
          <span className="text-xs font-medium text-slate-600">
            Permissions : {permissions.length}
          </span>
          {permissions.length > 0 && (
            <div className="mt-1 max-h-20 overflow-y-auto">
              <div className="flex flex-wrap gap-1">
                {permissions.slice(0, 6).map((permission) => (
                  <Badge key={permission} variant="outline" className="text-[10px] px-1 py-0">
                    {permission.replace('_', ' ')}
                  </Badge>
                ))}
                {permissions.length > 6 && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    +{permissions.length - 6}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRoleDisplay;
