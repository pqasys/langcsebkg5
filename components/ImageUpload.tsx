import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<string>;
  maxFiles?: number;
  label?: string;
  existingImages?: string[];
  onImageRemove?: (imageUrl: string) => void;
}

export default function ImageUpload({
  onImageUpload,
  maxFiles = 1,
  label = 'Upload Image',
  existingImages = [],
  onImageRemove,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length + existingImages.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      for (const file of acceptedFiles) {
        await onImageUpload(file);
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onImageUpload, maxFiles, existingImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles,
    disabled: uploading || existingImages.length >= maxFiles
  });

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading || existingImages.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-gray-500">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the image here...</p>
        ) : (
          <p className="text-gray-500">
            Drag and drop images here, or click to select files
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {existingImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <Image
                src={imageUrl}
                alt={`Uploaded image ${index + 1}`}
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              {onImageRemove && (
                <button
                  type="button"
                  onClick={() => onImageRemove(imageUrl)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 