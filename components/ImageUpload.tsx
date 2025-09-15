import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle, Check } from 'lucide-react';
import { s3Upload, UploadResult } from '@/services/s3Upload';

interface ImageUploadProps {
  folder: 'games' | 'consoles';
  onImagesUploaded: (urls: string[]) => void;
  onImagesDeleted?: (deletedUrls: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

export default function ImageUpload({ 
  folder, 
  onImagesUploaded, 
  onImagesDeleted,
  currentImages = [], 
  maxImages = 5,
  className = ''
}: ImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image format. Please use JPG, PNG, GIF, or WebP.`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Please use images smaller than 5MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Check if adding these files would exceed the limit
    const totalImages = currentImages.length + uploadingFiles.length + validFiles.length;
    if (totalImages > maxImages) {
      alert(`You can only upload up to ${maxImages} images total.`);
      return;
    }

    uploadFiles(validFiles);
  };

  const uploadFiles = async (files: File[]) => {
    const newUploadingFiles: UploadingFile[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload files one by one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileIndex = uploadingFiles.length + i;

      try {
        // Update progress to show uploading
        setUploadingFiles(prev => 
          prev.map((uploadFile, index) => 
            index === fileIndex 
              ? { ...uploadFile, progress: 50 }
              : uploadFile
          )
        );

        const result: UploadResult = await s3Upload.uploadImage(file, folder);

        if (result.success && result.url) {
          // Update to success
          setUploadingFiles(prev => 
            prev.map((uploadFile, index) => 
              index === fileIndex 
                ? { 
                    ...uploadFile, 
                    progress: 100, 
                    status: 'success' as const,
                    url: result.url 
                  }
                : uploadFile
            )
          );

          // Add to current images
          onImagesUploaded([...currentImages, result.url]);
        } else {
          // Update to error
          setUploadingFiles(prev => 
            prev.map((uploadFile, index) => 
              index === fileIndex 
                ? { 
                    ...uploadFile, 
                    status: 'error' as const,
                    error: result.error || 'Upload failed'
                  }
                : uploadFile
            )
          );
        }
      } catch (error) {
        setUploadingFiles(prev => 
          prev.map((uploadFile, index) => 
            index === fileIndex 
              ? { 
                  ...uploadFile, 
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Upload failed'
                }
              : uploadFile
          )
        );
      }
    }

    // Clean up completed uploads after a delay
    setTimeout(() => {
      setUploadingFiles(prev => 
        prev.filter(file => file.status === 'uploading')
      );
    }, 3000);
  };

  const removeImage = (index: number) => {
    const imageToDelete = currentImages[index];
    const newImages = currentImages.filter((_, i) => i !== index);
    const newDeletedImages = [...deletedImages, imageToDelete];
    
    setDeletedImages(newDeletedImages);
    onImagesUploaded(newImages);
    
    // Notify parent component about deleted images
    if (onImagesDeleted) {
      onImagesDeleted(newDeletedImages);
    }
  };

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${currentImages.length + uploadingFiles.length >= maxImages 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={currentImages.length + uploadingFiles.length < maxImages ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={currentImages.length + uploadingFiles.length >= maxImages}
        />
        
        <div className="space-y-2">
          <Upload className="w-8 h-8 mx-auto text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {currentImages.length + uploadingFiles.length >= maxImages
                ? `Maximum ${maxImages} images reached`
                : 'Click to upload or drag and drop'
              }
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WebP up to 5MB each
            </p>
            <p className="text-xs text-gray-400">
              {currentImages.length + uploadingFiles.length} of {maxImages} images
            </p>
          </div>
        </div>
      </div>

      {/* Current Images */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentImages.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM4LjY4NjI5IDE2IDYgMTMuMzEzNyA2IDEwQzYgNi42ODYyOSA4LjY4NjI5IDQgMTIgNEMxNS4zMTM3IDQgMTggNi42ODYyOSAxOCAxMEMxOCAxMy4zMTM3IDE1LjMxMzcgMTYgMTIgMTZaIiBmaWxsPSIjOUM5Qzk3Ii8+CjxwYXRoIGQ9Ik0xMiAxNEMxMy4xMDQ2IDE0IDE0IDEzLjEwNDYgMTQgMTJDMTQgMTAuODk1NCAxMy4xMDQ2IDEwIDEyIDEwQzEwLjg5NTQgMTAgMTAgMTAuODk1NCAxMCAxMkMxMCAxMy4xMDQ2IDEwLjg5NTQgMTQgMTIgMTRaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=';
                  }}
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading...</h4>
          {uploadingFiles.map((uploadFile, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {uploadFile.status === 'uploading' && (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                )}
                {uploadFile.status === 'success' && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {uploadFile.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadFile.file.name}
                </p>
                {uploadFile.status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadFile.progress}%` }}
                    />
                  </div>
                )}
                {uploadFile.status === 'success' && (
                  <p className="text-xs text-green-600">Upload successful</p>
                )}
                {uploadFile.status === 'error' && (
                  <p className="text-xs text-red-600">{uploadFile.error}</p>
                )}
              </div>

              {uploadFile.status !== 'uploading' && (
                <button
                  onClick={() => removeUploadingFile(index)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Images Preview Grid for Uploaded Files */}
      {uploadingFiles.some(f => f.status === 'success' && f.url) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadingFiles
            .filter(f => f.status === 'success' && f.url)
            .map((uploadFile, index) => (
              <div key={`upload-${index}`} className="relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={uploadFile.url}
                    alt={`Uploaded ${uploadFile.file.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
