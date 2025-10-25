import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DocumentCategory = ({ category, onUpload, onViewDocument, onApprove, onReject }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-error text-error-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return 'CheckCircle';
      case 'rejected':
        return 'XCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'FileText';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-minimal">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={category?.icon} size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{category?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category?.uploadedCount} of {category?.requiredCount} documents
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category?.status)}`}>
            <Icon name={getStatusIcon(category?.status)} size={12} className="inline mr-1" />
            {category?.status}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpload(category?.id)}
            iconName="Upload"
            iconPosition="left"
          >
            Upload
          </Button>
        </div>
      </div>
      {category?.documents?.length > 0 ? (
        <div className="space-y-3">
          {category?.documents?.map((doc) => (
            <div key={doc?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-background rounded-lg overflow-hidden flex items-center justify-center border">
                  {doc?.type === 'pdf' ? (
                    <Icon name="FileText" size={20} color="var(--color-error)" />
                  ) : (
                    <Image
                      src={doc?.thumbnail}
                      alt={doc?.thumbnailAlt}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{doc?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {doc?.uploadDate} • {doc?.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc?.status)}`}>
                  {doc?.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDocument(doc)}
                  iconName="Eye"
                />
                {doc?.status === 'pending' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove(doc?.id)}
                      iconName="Check"
                      className="text-success hover:text-success"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReject(doc?.id)}
                      iconName="X"
                      className="text-error hover:text-error"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="FileX" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
          <p className="text-muted-foreground">No documents uploaded yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click upload to add {category?.name?.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentCategory;