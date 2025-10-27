import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressTracker = ({ 
  completedDocuments, 
  totalDocuments, 
  estimatedDays 
}) => {
  const progressPercentage = Math.round((completedDocuments / totalDocuments) * 100);
  
  const getProgressColor = () => {
    if (progressPercentage >= 80) return 'bg-success';
    if (progressPercentage >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  const getProgressTextColor = () => {
    if (progressPercentage >= 80) return 'text-success';
    if (progressPercentage >= 50) return 'text-warning';
    return 'text-primary';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-minimal">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Document Progress</h2>
          <p className="text-sm text-muted-foreground">
            {completedDocuments} of {totalDocuments} documents submitted
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getProgressTextColor()}`}>
            {progressPercentage}%
          </div>
          <p className="text-xs text-muted-foreground">Complete</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{completedDocuments}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="Clock" size={16} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {totalDocuments - completedDocuments}
              </p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Calendar" size={16} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{estimatedDays}</p>
              <p className="text-xs text-muted-foreground">Days to funding</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {progressPercentage < 100 && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} color="var(--color-primary)" />
              <div>
                <p className="text-sm font-medium text-primary">Next Steps</p>
                <p className="text-sm text-primary/80 mt-1">
                  Complete the remaining {totalDocuments - completedDocuments} document{totalDocuments - completedDocuments !== 1 ? 's' : ''} to expedite your funding approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {progressPercentage === 100 && (
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              <div>
                <p className="text-sm font-medium text-success">All Documents Submitted!</p>
                <p className="text-sm text-success/80 mt-1">
                  Your dealer is reviewing your documents. You'll be notified once funding is approved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;