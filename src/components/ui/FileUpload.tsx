
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesChange, 
  maxFiles = 10,
  acceptedTypes = ['image/*', 'video/*']
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => {
      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      
      return {
        id,
        file,
        preview,
        type
      };
    });

    const updatedFiles = [...uploadedFiles, ...newFiles].slice(0, maxFiles);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [uploadedFiles, maxFiles, onFilesChange]);

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploadedFiles.length >= maxFiles
  });

  const getFileIcon = (type: string) => {
    if (type === 'image') return <Image className="h-4 w-4" />;
    if (type === 'video') return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {uploadedFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-slate-300 bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">
            {isDragActive
              ? 'Déposez vos fichiers ici...'
              : 'Glissez-déposez vos photos et vidéos ici ou cliquez pour sélectionner'}
          </p>
                      <Button variant="outline" className="border-slate-300 text-slate-700">
            <Upload className="h-4 w-4 mr-2" />
            Sélectionner des fichiers
          </Button>
          <p className="text-xs text-slate-500 mt-2">
            Formats acceptés: Images (JPG, PNG, GIF) et Vidéos (MP4, MOV, AVI)
          </p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="relative group">
              <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                {file.type === 'image' ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={file.preview}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                )}
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                {getFileIcon(file.type)}
                <span className="truncate max-w-20">{file.file.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <p className="text-sm text-slate-500 text-center">
          {uploadedFiles.length} / {maxFiles} fichiers sélectionnés
        </p>
      )}
    </div>
  );
};

export default FileUpload;
