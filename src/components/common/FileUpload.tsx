import React, { useCallback, useState } from 'react';
import { FilePreview } from './FilePreview';

interface FileUploadProps {
  label: string;
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  existingFiles?: string[];
  onRemove?: (index: number) => void;
}

export const FileUpload = ({
  label,
  onChange,
  accept,
  multiple = false,
  existingFiles = [],
  onRemove
}: FileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    onChange(files);
    e.target.value = '';
  }, [onChange]);

  const handleRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <div className="flex text-sm text-gray-600">
            <label htmlFor={`file-upload-${label}`} className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
              <span>Upload files</span>
              <input
                id={`file-upload-${label}`}
                name={`file-upload-${label}`}
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            {accept ? `Allowed files: ${accept}` : 'Any file type allowed'}
          </p>
        </div>
      </div>

      {/* Preview for newly selected files */}
      {selectedFiles.length > 0 && (
        <FilePreview files={selectedFiles} onRemove={handleRemove} />
      )}

      {/* Display existing files */}
      {existingFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {existingFiles.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative h-24 w-full">
                <img
                  src={url}
                  alt={`File ${index + 1}`}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};