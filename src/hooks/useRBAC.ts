
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type CommandType = 
  | 'CREATE_USER' | 'EDIT_USER' | 'VIEW_USER' | 'DELETE_USER'
  | 'CREATE_CONSEILLER' | 'EDIT_CONSEILLER' | 'VIEW_CONSEILLER' | 'DELETE_CONSEILLER'
  | 'CREATE_PROPERTY' | 'EDIT_PROPERTY' | 'VIEW_PROPERTY' | 'DELETE_PROPERTY'
  | 'CREATE_TASK' | 'EDIT_TASK' | 'VIEW_TASK' | 'DELETE_TASK'
  | 'VIEW_REPORTS' | 'MANAGE_ROLES' | 'MANAGE_PERMISSIONS';

export type PermissionLevel = 'GLOBAL' | 'ACCOUNT' | 'OWN';

export interface Role {
  id: string;
  name: string;
  description: string;
  is_system_role: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  command: CommandType;
  permission_level: PermissionLevel;
}

export const useRBAC = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<CommandType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserRolesAndPermissions();
    } else {
      setUserRoles([]);
      setPermissions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserRolesAndPermissions = async () => {
    if (!user) return;

    try {
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .rpc('get_user_roles', { user_uuid: user.id });

      if (rolesError) throw rolesError;

      const roles = rolesData?.map((item: { role_name: string }) => item.role_name) || [];
      setUserRoles(roles);

      // Fetch user permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles!inner(
            role_permissions!inner(
              permissions!inner(command)
            )
          )
        `)
        .eq('user_id', user.id);

      if (permissionsError) throw permissionsError;

      const userPermissions: CommandType[] = [];
      permissionsData?.forEach((userRole: any) => {
        userRole.roles.role_permissions.forEach((rp: any) => {
          if (!userPermissions.includes(rp.permissions.command)) {
            userPermissions.push(rp.permissions.command);
          }
        });
      });

      setPermissions(userPermissions);
    } catch (error) {
      console.error('Error fetching user roles and permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roleName: string): boolean => {
    return userRoles.includes(roleName);
  };

  const hasPermission = (command: CommandType): boolean => {
    return permissions.includes(command);
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    return roleNames.some(role => userRoles.includes(role));
  };

  const hasAllRoles = (roleNames: string[]): boolean => {
    return roleNames.every(role => userRoles.includes(role));
  };

  const hasAnyPermission = (commands: CommandType[]): boolean => {
    return commands.some(command => permissions.includes(command));
  };

  const isAdmin = (): boolean => {
    return hasRole('Admin');
  };

  const isManager = (): boolean => {
    return hasRole('Manager');
  };

  const isEmployee = (): boolean => {
    return hasRole('Employee');
  };

  const canManageUsers = (): boolean => {
    return hasAnyPermission(['CREATE_USER', 'EDIT_USER', 'DELETE_USER']);
  };

  const canManageConseillers = (): boolean => {
    return hasAnyPermission(['CREATE_CONSEILLER', 'EDIT_CONSEILLER', 'DELETE_CONSEILLER']);
  };

  const canManageProperties = (): boolean => {
    return hasAnyPermission(['CREATE_PROPERTY', 'EDIT_PROPERTY', 'DELETE_PROPERTY']);
  };

  const canManageTasks = (): boolean => {
    return hasAnyPermission(['CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK']);
  };

  return {
    userRoles,
    permissions,
    loading,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    isAdmin,
    isManager,
    isEmployee,
    canManageUsers,
    canManageConseillers,
    canManageProperties,
    canManageTasks,
    refetch: fetchUserRolesAndPermissions
  };
};
