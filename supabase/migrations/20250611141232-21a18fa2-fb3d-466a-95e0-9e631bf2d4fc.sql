
-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property_media table
CREATE TABLE public.property_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;

-- RLS policies for properties
CREATE POLICY "Users can view their own properties" 
  ON public.properties 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties" 
  ON public.properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
  ON public.properties 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
  ON public.properties 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for property_media
CREATE POLICY "Users can view media of their own properties" 
  ON public.property_media 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_media.property_id 
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can create media for their own properties" 
  ON public.property_media 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_media.property_id 
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can update media of their own properties" 
  ON public.property_media 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_media.property_id 
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete media of their own properties" 
  ON public.property_media 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_media.property_id 
    AND properties.user_id = auth.uid()
  ));

-- Create storage bucket for property media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-media', 'property-media', true);

-- Storage policies for property-media bucket
CREATE POLICY "Anyone can view property media" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'property-media');

CREATE POLICY "Authenticated users can upload property media" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'property-media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own property media" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'property-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own property media" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'property-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to create a property
CREATE OR REPLACE FUNCTION public.create_property(
  p_user_id UUID,
  p_metadata JSONB
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_property_id UUID;
BEGIN
  INSERT INTO public.properties (user_id, metadata)
  VALUES (p_user_id, p_metadata)
  RETURNING id INTO new_property_id;
  
  RETURN new_property_id;
END;
$$;

-- Function to create property media
CREATE OR REPLACE FUNCTION public.create_property_media(
  p_property_id UUID,
  p_file_name TEXT,
  p_file_path TEXT,
  p_file_type TEXT,
  p_file_size INTEGER,
  p_mime_type TEXT
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_media_id UUID;
BEGIN
  INSERT INTO public.property_media (
    property_id, 
    file_name, 
    file_path, 
    file_type, 
    file_size, 
    mime_type
  )
  VALUES (
    p_property_id, 
    p_file_name, 
    p_file_path, 
    p_file_type, 
    p_file_size, 
    p_mime_type
  )
  RETURNING id INTO new_media_id;
  
  RETURN new_media_id;
END;
$$;
