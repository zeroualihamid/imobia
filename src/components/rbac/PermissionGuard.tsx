
import React from 'react';
import { useRBAC, CommandType } from '@/hooks/useRBAC';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: CommandType;
  role?: string;
  anyPermissions?: CommandType[];
  anyRoles?: string[];
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  role,
  anyPermissions,
  anyRoles,
  fallback = null,
  loading: loadingComponent = null
}) => {
  const { hasPermission, hasRole, hasAnyPermission, hasAnyRole, loading } = useRBAC();

  if (loading) {
    return loadingComponent ? <>{loadingComponent}</> : null;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (role) {
    hasAccess = hasRole(role);
  } else if (anyPermissions) {
    hasAccess = hasAnyPermission(anyPermissions);
  } else if (anyRoles) {
    hasAccess = hasAnyRole(anyRoles);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
