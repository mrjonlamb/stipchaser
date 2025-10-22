import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFileUpload, acceptedTypes = '.pdf,.jpg,.jpeg,.png', maxSize = 10 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter(file => {
      const isValidType = acceptedTypes?.split(',')?.some(type => 
        file?.name?.toLowerCase()?.endsWith(type?.replace('.', ''))
      );
      const isValidSize = file?.size <= maxSize * 1024 * 1024;
      return isValidType && isValidSize;
    });

    validFiles?.forEach(file => {
      const fileId = Date.now() + Math.random();
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev?.[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress?.[fileId];
                return newProgress;
              });
            }, 1000);
            onFileUpload(file);
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 200);
    });
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-minimal">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragOver 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="mb-4">
          <Icon 
            name="Upload" 
            size={48} 
            color={isDragOver ? "var(--color-primary)" : "var(--color-muted-foreground)"} 
            className="mx-auto mb-3" 
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-muted-foreground mb-4">
            Support for PDF, JPG, PNG files up to {maxSize}MB each
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            onClick={openFileDialog}
            iconName="FolderOpen"
            iconPosition="left"
          >
            Choose Files
          </Button>
          <Button
            variant="ghost"
            iconName="Camera"
            iconPosition="left"
            className="sm:ml-2"
          >
            Take Photo
          </Button>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Accepted formats: {acceptedTypes?.replace(/\./g, '')?.toUpperCase()}</p>
          <p>Maximum file size: {maxSize}MB per file</p>
        </div>
      </div>
      {/* Upload Progress */}
      {Object.keys(uploadProgress)?.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-foreground">Uploading Files</h4>
          {Object.entries(uploadProgress)?.map(([fileId, progress]) => (
            <div key={fileId} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Uploading document...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadZone;