import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActions = ({ 
  selectedDocuments, 
  onSelectAll, 
  onDeselectAll, 
  onBulkApprove, 
  onBulkReject, 
  onBulkDownload,
  onBulkShare,
  totalDocuments 
}) => {
  const [showBulkRejectForm, setShowBulkRejectForm] = useState(false);
  const [bulkRejectionReason, setBulkRejectionReason] = useState('');

  const selectedCount = selectedDocuments?.length;
  const isAllSelected = selectedCount === totalDocuments && totalDocuments > 0;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalDocuments;

  const handleBulkReject = () => {
    if (bulkRejectionReason?.trim()) {
      onBulkReject(selectedDocuments, bulkRejectionReason);
      setBulkRejectionReason('');
      setShowBulkRejectForm(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-minimal">
      {/* Selection Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isPartiallySelected}
            onChange={(e) => {
              if (e?.target?.checked) {
                onSelectAll();
              } else {
                onDeselectAll();
              }
            }}
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              {selectedCount} of {totalDocuments} documents selected
            </p>
            <p className="text-xs text-muted-foreground">
              Select documents to perform bulk actions
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeselectAll}
          iconName="X"
        >
          Clear Selection
        </Button>
      </div>
      {/* Bulk Actions */}
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="success"
            size="sm"
            onClick={() => onBulkApprove(selectedDocuments)}
            iconName="Check"
            iconPosition="left"
          >
            Approve Selected ({selectedCount})
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowBulkRejectForm(true)}
            iconName="X"
            iconPosition="left"
          >
            Reject Selected ({selectedCount})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkDownload(selectedDocuments)}
            iconName="Download"
            iconPosition="left"
          >
            Download Selected
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkShare(selectedDocuments)}
            iconName="Share"
            iconPosition="left"
          >
            Share Selected
          </Button>
        </div>

        {/* Bulk Rejection Form */}
        {showBulkRejectForm && (
          <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Reject {selectedCount} Selected Documents
            </h4>
            <textarea
              value={bulkRejectionReason}
              onChange={(e) => setBulkRejectionReason(e?.target?.value)}
              placeholder="Please provide a reason for rejecting these documents..."
              className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="flex items-center space-x-3 mt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkReject}
                disabled={!bulkRejectionReason?.trim()}
              >
                Confirm Bulk Rejection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowBulkRejectForm(false);
                  setBulkRejectionReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;