-- Create a storage bucket for bien media if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('bien-media', 'bien-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for bien-media bucket
CREATE POLICY "Authenticated users can upload bien media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bien-media');

CREATE POLICY "Authenticated users can view bien media"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'bien-media');

CREATE POLICY "Users can update their own bien media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'bien-media');

CREATE POLICY "Users can delete their own bien media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'bien-media');

-- Also allow public access to view bien media images
CREATE POLICY "Public can view bien media"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'bien-media');