
-- Add a property_id column to the tasks table to link tasks with properties
ALTER TABLE public.tasks 
ADD COLUMN property_id UUID REFERENCES public.properties(id);

-- Create an index for better performance when querying tasks by property
CREATE INDEX idx_tasks_property_id ON public.tasks(property_id);
