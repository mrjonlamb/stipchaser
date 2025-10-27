import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ConversationDetails = ({ 
  conversation, 
  onRequestDocument, 
  onViewDocuments,
  isVisible,
  onToggle 
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const documentTemplates = [
    { id: 'paystub', name: 'Pay Stub', icon: 'Receipt', description: 'Recent pay stub or salary slip' },
    { id: 'bank', name: 'Bank Statement', icon: 'CreditCard', description: 'Last 3 months bank statements' },
    { id: 'utility', name: 'Utility Bill', icon: 'Zap', description: 'Electric, gas, or water bill' },
    { id: 'insurance', name: 'Insurance', icon: 'Shield', description: 'Auto insurance documentation' },
    { id: 'employment', name: 'Employment Letter', icon: 'Briefcase', description: 'Letter of employment verification' },
    { id: 'tax', name: 'Tax Return', icon: 'FileText', description: 'Previous year tax return' }
  ];

  const dealInfo = {
    vehicleYear: '2024',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry LE',
    vin: '1HGBH41JXMN109186',
    salePrice: '$28,500',
    downPayment: '$5,000',
    loanAmount: '$23,500',
    apr: '4.9%',
    term: '60 months',
    monthlyPayment: '$441',
    dealerName: 'Premium Auto Sales',
    salesPerson: 'Michael Rodriguez',
    financeManager: 'Sarah Chen'
  };

  const recentDocuments = [
    {
      id: 1,
      name: 'Pay_Stub_October_2024.pdf',
      type: 'paystub',
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'approved',
      size: '245 KB'
    },
    {
      id: 2,
      name: 'Bank_Statement_September.pdf',
      type: 'bank',
      uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'pending',
      size: '1.2 MB'
    },
    {
      id: 3,
      name: 'Electric_Bill_October.pdf',
      type: 'utility',
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'rejected',
      size: '156 KB',
      rejectionReason: 'Document is not clear, please resubmit'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'rejected': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'rejected': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatUploadTime = (timestamp) => {
    const now = new Date();
    const uploadTime = new Date(timestamp);
    const diffInHours = (now - uploadTime) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return uploadTime?.toLocaleDateString();
    }
  };

  if (!conversation) return null;

  return (
    <div className={`${isVisible ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-l border-border flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Details</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onToggle}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { id: 'info', label: 'Deal Info', icon: 'Car' },
            { id: 'documents', label: 'Documents', icon: 'FileText' },
            { id: 'templates', label: 'Templates', icon: 'Layout' }
          ]?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={12} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Customer Info */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Customer</h4>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Image
                  src={conversation?.customerAvatar}
                  alt={conversation?.customerAvatarAlt}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{conversation?.customerName}</p>
                  <p className="text-sm text-muted-foreground">Deal #{conversation?.dealNumber}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Vehicle</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Year/Make/Model:</span>
                  <span className="text-sm font-medium">{dealInfo?.vehicleYear} {dealInfo?.vehicleMake} {dealInfo?.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">VIN:</span>
                  <span className="text-sm font-mono">{dealInfo?.vin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sale Price:</span>
                  <span className="text-sm font-medium text-success">{dealInfo?.salePrice}</span>
                </div>
              </div>
            </div>

            {/* Financing Info */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Financing</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Down Payment:</span>
                  <span className="text-sm font-medium">{dealInfo?.downPayment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Loan Amount:</span>
                  <span className="text-sm font-medium">{dealInfo?.loanAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">APR:</span>
                  <span className="text-sm font-medium">{dealInfo?.apr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Term:</span>
                  <span className="text-sm font-medium">{dealInfo?.term}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Payment:</span>
                  <span className="text-sm font-medium text-primary">{dealInfo?.monthlyPayment}</span>
                </div>
              </div>
            </div>

            {/* Team Info */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Team</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sales Person:</span>
                  <span className="text-sm font-medium">{dealInfo?.salesPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Finance Manager:</span>
                  <span className="text-sm font-medium">{dealInfo?.financeManager}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Recent Documents</h4>
              <Button
                variant="outline"
                size="xs"
                iconName="ExternalLink"
                onClick={onViewDocuments}
              >
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {recentDocuments?.map((doc) => (
                <div key={doc?.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="FileText" size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {doc?.name}
                      </span>
                    </div>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc?.status)}`}>
                      <Icon name={getStatusIcon(doc?.status)} size={10} />
                      <span className="capitalize">{doc?.status}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{doc?.size}</span>
                    <span>{formatUploadTime(doc?.uploadedAt)}</span>
                  </div>

                  {doc?.status === 'rejected' && doc?.rejectionReason && (
                    <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded text-xs text-error">
                      {doc?.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Quick Document Requests</h4>
            
            <div className="space-y-2">
              {documentTemplates?.map((template) => (
                <button
                  key={template?.id}
                  onClick={() => onRequestDocument(template)}
                  className="w-full p-3 text-left border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name={template?.icon} size={16} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-foreground">{template?.name}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{template?.description}</p>
                    </div>
                    <Icon name="Send" size={14} className="text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                className="w-full"
              >
                Create Custom Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationDetails;