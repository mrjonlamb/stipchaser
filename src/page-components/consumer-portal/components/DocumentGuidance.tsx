import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentGuidance = () => {
  const [activeTab, setActiveTab] = useState('tips');

  const documentTips = [
    {
      icon: 'FileText',
      title: 'Clear & Complete',
      description: 'Ensure all text is readable and no information is cut off'
    },
    {
      icon: 'Camera',
      title: 'Good Lighting',
      description: 'Take photos in well-lit areas to avoid shadows and blur'
    },
    {
      icon: 'Maximize',
      title: 'Full Document',
      description: 'Capture the entire document including headers and footers'
    },
    {
      icon: 'FileCheck',
      title: 'Recent Dates',
      description: 'Submit documents dated within the last 30-60 days when required'
    }
  ];

  const commonFormats = [
    { format: 'PDF', description: 'Best for scanned documents', recommended: true },
    { format: 'JPG/JPEG', description: 'Good for photos and images', recommended: true },
    { format: 'PNG', description: 'High quality images', recommended: true },
    { format: 'HEIC', description: 'iPhone photos (will be converted)', recommended: false }
  ];

  const troubleshooting = [
    {
      issue: 'File too large',
      solution: 'Compress images or use PDF format. Maximum size is 10MB per file.'
    },
    {
      issue: 'Blurry photos',
      solution: 'Hold device steady, ensure good lighting, and tap to focus before capturing.'
    },
    {
      issue: 'Document rejected',
      solution: 'Check dealer feedback and resubmit with corrections. Ensure all required information is visible.'
    },
    {
      issue: 'Upload failed',
      solution: 'Check internet connection and try again. Contact support if issue persists.'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-minimal">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-foreground">Document Guidance</h3>
      </div>
      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'tips' ?'bg-card text-foreground shadow-minimal' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Tips
        </button>
        <button
          onClick={() => setActiveTab('formats')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'formats'
              ? 'bg-card text-foreground shadow-minimal' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Formats
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'help' ?'bg-card text-foreground shadow-minimal' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          Help
        </button>
      </div>
      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documentTips?.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={tip?.icon} size={16} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tip?.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tip?.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'formats' && (
          <div className="space-y-3">
            {commonFormats?.map((format, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Icon name="File" size={16} color="var(--color-secondary)" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{format?.format}</p>
                    <p className="text-xs text-muted-foreground">{format?.description}</p>
                  </div>
                </div>
                {format?.recommended && (
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-4">
            {troubleshooting?.map((item, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={16} color="var(--color-warning)" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">{item?.issue}</p>
                    <p className="text-sm text-muted-foreground">{item?.solution}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                iconName="MessageSquare"
                iconPosition="left"
                fullWidth
              >
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentGuidance;