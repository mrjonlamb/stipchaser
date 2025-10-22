import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const DocumentUploadCard = ({ 
  document, 
  onUpload, 
  onRemove, 
  onPreview 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
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
    if (files?.length > 0) {
      onUpload(document?.id, files?.[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      onUpload(document?.id, file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef?.current) {
      fileInputRef?.current?.setAttribute('capture', 'environment');
      fileInputRef?.current?.click();
    }
  };

  const getStatusIcon = () => {
    switch (document?.status) {
      case 'completed':
        return <Icon name="CheckCircle" size={20} color="var(--color-success)" />;
      case 'pending':
        return <Icon name="Clock" size={20} color="var(--color-warning)" />;
      case 'needs_revision':
        return <Icon name="AlertCircle" size={20} color="var(--color-error)" />;
      default:
        return <Icon name="Circle" size={20} color="var(--color-muted-foreground)" />;
    }
  };

  const getStatusText = () => {
    switch (document?.status) {
      case 'completed':
        return 'Approved';
      case 'pending':
        return 'Under Review';
      case 'needs_revision':
        return 'Needs Revision';
      default:
        return 'Required';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-minimal">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{document?.title}</h3>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${
                document?.status === 'completed' ? 'text-success' :
                document?.status === 'pending' ? 'text-warning' :
                document?.status === 'needs_revision'? 'text-error' : 'text-muted-foreground'
              }`}>
                {getStatusText()}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{document?.description}</p>
          {document?.requirements && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Requirements:</span> {document?.requirements}
            </div>
          )}
        </div>
      </div>
      {document?.uploadedFile ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {document?.uploadedFile?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Uploaded {document?.uploadedFile?.uploadedAt} • {document?.uploadedFile?.size}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPreview(document?.uploadedFile)}
              >
                <Icon name="Eye" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(document?.id)}
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>

          {document?.status === 'needs_revision' && document?.feedback && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} color="var(--color-error)" />
                <div>
                  <p className="text-sm font-medium text-error">Revision Required</p>
                  <p className="text-sm text-error/80 mt-1">{document?.feedback}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
              <Icon name="Upload" size={24} color="var(--color-muted-foreground)" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Drop your file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, JPG, PNG up to 10MB
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef?.current?.click()}
                iconName="FolderOpen"
                iconPosition="left"
              >
                Browse Files
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCameraCapture}
                iconName="Camera"
                iconPosition="left"
                className="sm:hidden"
              >
                Take Photo
              </Button>
            </div>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default DocumentUploadCard;