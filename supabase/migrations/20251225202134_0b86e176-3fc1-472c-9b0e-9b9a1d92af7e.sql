-- Drop the existing foreign key constraint
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_property_id_fkey;

-- Re-create with ON DELETE CASCADE
ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;