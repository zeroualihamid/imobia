
-- Create the admin user profile first
INSERT INTO public.profiles (id, email, full_name)
VALUES ('91874296-5f21-4fa3-8288-5cd627b49a8f', 'admin@imobia.com', 'Administrator')
ON CONFLICT (id) DO NOTHING;

-- Get the Admin role ID and assign it to the user
INSERT INTO public.user_roles (user_id, role_id)
SELECT '91874296-5f21-4fa3-8288-5cd627b49a8f', r.id
FROM public.roles r
WHERE r.name = 'Admin'
ON CONFLICT (user_id, role_id) DO NOTHING;
