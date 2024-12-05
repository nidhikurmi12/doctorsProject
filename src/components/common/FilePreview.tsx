import React from 'react';
import { X } from 'lucide-react';

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const FilePreview = ({ files, onRemove }: FilePreviewProps) => {
  const previewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const isImage = (file: File) => {
    return file.type.startsWith('image/');
  };

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file, index) => (
        <div key={index} className="relative group">
          {isImage(file) ? (
            <div className="relative h-24 w-full">
              <img
                src={previewUrl(file)}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="h-24 w-full bg-gray-100 flex items-center justify-center rounded-md">
              <span className="text-sm text-gray-600">{file.name}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};