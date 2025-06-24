
-- Create enum types for better type safety
CREATE TYPE public.permission_level AS ENUM ('GLOBAL', 'ACCOUNT', 'OWN');
CREATE TYPE public.command_type AS ENUM (
  'CREATE_USER', 'EDIT_USER', 'VIEW_USER', 'DELETE_USER',
  'CREATE_CONSEILLER', 'EDIT_CONSEILLER', 'VIEW_CONSEILLER', 'DELETE_CONSEILLER',
  'CREATE_PROPERTY', 'EDIT_PROPERTY', 'VIEW_PROPERTY', 'DELETE_PROPERTY',
  'CREATE_TASK', 'EDIT_TASK', 'VIEW_TASK', 'DELETE_TASK',
  'VIEW_REPORTS', 'MANAGE_ROLES', 'MANAGE_PERMISSIONS'
);

-- Create the core RBAC tables
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  command command_type NOT NULL,
  permission_level permission_level NOT NULL DEFAULT 'OWN',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role_id)
);

CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Enable RLS on all RBAC tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to check permissions
CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid UUID)
RETURNS TABLE(role_name TEXT) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT r.name
  FROM public.roles r
  JOIN public.user_roles ur ON r.id = ur.role_id
  WHERE ur.user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.user_has_permission(user_uuid UUID, command_name command_type)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = user_uuid
    AND p.command = command_name
  );
$$;

CREATE OR REPLACE FUNCTION public.user_has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid
    AND r.name = role_name
  );
$$;

-- RLS Policies for roles table
CREATE POLICY "Authenticated users can view all roles"
  ON public.roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.roles FOR ALL
  TO authenticated
  USING (public.user_has_role(auth.uid(), 'Admin'));

-- RLS Policies for permissions table
CREATE POLICY "Authenticated users can view all permissions"
  ON public.permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage permissions"
  ON public.permissions FOR ALL
  TO authenticated
  USING (public.user_has_role(auth.uid(), 'Admin'));

-- RLS Policies for user_roles table
CREATE POLICY "Users can view all user roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can assign roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can remove roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.user_has_role(auth.uid(), 'Admin'));

-- RLS Policies for role_permissions table
CREATE POLICY "Users can view role permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage role permissions"
  ON public.role_permissions FOR ALL
  TO authenticated
  USING (public.user_has_role(auth.uid(), 'Admin'));

-- Insert default roles
INSERT INTO public.roles (name, description, is_system_role) VALUES
  ('Admin', 'Full system administrator with all permissions', true),
  ('Manager', 'Manager with limited administrative permissions', true),
  ('Employee', 'Standard employee with basic permissions', true),
  ('Viewer', 'Read-only access to most data', true);

-- Insert default permissions
INSERT INTO public.permissions (name, description, command, permission_level) VALUES
  ('Create Users', 'Can create new users', 'CREATE_USER', 'GLOBAL'),
  ('Edit Users', 'Can edit user information', 'EDIT_USER', 'GLOBAL'),
  ('View Users', 'Can view user information', 'VIEW_USER', 'GLOBAL'),
  ('Delete Users', 'Can delete users', 'DELETE_USER', 'GLOBAL'),
  ('Create Conseillers', 'Can create new conseillers', 'CREATE_CONSEILLER', 'GLOBAL'),
  ('Edit Conseillers', 'Can edit conseiller information', 'EDIT_CONSEILLER', 'GLOBAL'),
  ('View Conseillers', 'Can view conseiller information', 'VIEW_CONSEILLER', 'GLOBAL'),
  ('Delete Conseillers', 'Can delete conseillers', 'DELETE_CONSEILLER', 'GLOBAL'),
  ('Create Properties', 'Can create new properties', 'CREATE_PROPERTY', 'GLOBAL'),
  ('Edit Properties', 'Can edit property information', 'EDIT_PROPERTY', 'GLOBAL'),
  ('View Properties', 'Can view property information', 'VIEW_PROPERTY', 'GLOBAL'),
  ('Delete Properties', 'Can delete properties', 'DELETE_PROPERTY', 'GLOBAL'),
  ('Create Tasks', 'Can create new tasks', 'CREATE_TASK', 'GLOBAL'),
  ('Edit Tasks', 'Can edit task information', 'EDIT_TASK', 'GLOBAL'),
  ('View Tasks', 'Can view task information', 'VIEW_TASK', 'GLOBAL'),
  ('Delete Tasks', 'Can delete tasks', 'DELETE_TASK', 'GLOBAL'),
  ('View Reports', 'Can view system reports', 'VIEW_REPORTS', 'GLOBAL'),
  ('Manage Roles', 'Can manage user roles and permissions', 'MANAGE_ROLES', 'GLOBAL'),
  ('Manage Permissions', 'Can manage system permissions', 'MANAGE_PERMISSIONS', 'GLOBAL'),
  ('Edit Own Profile', 'Can edit own user profile', 'EDIT_USER', 'OWN'),
  ('View Own Data', 'Can view own data only', 'VIEW_USER', 'OWN');

-- Assign permissions to default roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'Admin'; -- Admin gets all permissions

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'Manager'
AND p.command IN ('VIEW_USER', 'VIEW_CONSEILLER', 'CREATE_CONSEILLER', 'EDIT_CONSEILLER', 'VIEW_PROPERTY', 'CREATE_PROPERTY', 'EDIT_PROPERTY', 'VIEW_TASK', 'CREATE_TASK', 'EDIT_TASK', 'VIEW_REPORTS');

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'Employee'
AND p.command IN ('VIEW_CONSEILLER', 'VIEW_PROPERTY', 'VIEW_TASK', 'CREATE_TASK', 'EDIT_TASK')
AND p.permission_level IN ('GLOBAL', 'OWN');

-- Fixed: Use explicit enum values instead of LIKE operator for Viewer role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'Viewer'
AND p.command IN ('VIEW_USER', 'VIEW_CONSEILLER', 'VIEW_PROPERTY', 'VIEW_TASK', 'VIEW_REPORTS');
