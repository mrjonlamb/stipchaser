import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DocumentPreview = ({ document, onClose, onApprove, onReject, onShare }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  if (!document) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="FileText" size={64} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Document Selected</h3>
        <p className="text-muted-foreground">Select a document from the categories to preview it here</p>
      </div>
    );
  }

  const handleReject = () => {
    if (rejectionReason?.trim()) {
      onReject(document?.id, rejectionReason);
      setRejectionReason('');
      setShowRejectionForm(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-minimal">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={16} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{document?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {document?.category} • Uploaded {document?.uploadDate}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} iconName="X" />
      </div>
      {/* Document Content */}
      <div className="p-4">
        <div className="bg-muted/30 rounded-lg p-8 mb-4 min-h-96 flex items-center justify-center">
          {document?.type === 'pdf' ? (
            <div className="text-center">
              <Icon name="FileText" size={64} color="var(--color-error)" className="mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">{document?.name}</p>
              <p className="text-sm text-muted-foreground mb-4">PDF Document • {document?.size}</p>
              <Button variant="outline" iconName="ExternalLink" iconPosition="left">
                Open in New Tab
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <Image
                src={document?.url}
                alt={document?.alt}
                className="w-full h-auto rounded-lg shadow-moderate"
              />
            </div>
          )}
        </div>

        {/* Document Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">File Information</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Size: {document?.size}</p>
              <p>Type: {document?.type?.toUpperCase()}</p>
              <p>Uploaded: {document?.uploadDate}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Status</p>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                document?.status === 'approved' ? 'bg-success text-success-foreground' :
                document?.status === 'rejected' ? 'bg-error text-error-foreground' :
                'bg-warning text-warning-foreground'
              }`}>
                {document?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Rejection Form */}
        {showRejectionForm && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Rejection Reason</h4>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e?.target?.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="flex items-center space-x-2 mt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReject}
                disabled={!rejectionReason?.trim()}
              >
                Confirm Rejection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRejectionForm(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {document?.status === 'pending' && (
          <div className="flex items-center space-x-3">
            <Button
              variant="success"
              onClick={() => onApprove(document?.id)}
              iconName="Check"
              iconPosition="left"
            >
              Approve Document
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowRejectionForm(true)}
              iconName="X"
              iconPosition="left"
            >
              Reject Document
            </Button>
            <Button
              variant="outline"
              onClick={() => onShare(document?.id)}
              iconName="Share"
              iconPosition="left"
            >
              Share
            </Button>
          </div>
        )}

        {document?.status === 'approved' && (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => onShare(document?.id)}
              iconName="Share"
              iconPosition="left"
            >
              Share Document
            </Button>
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
            >
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;