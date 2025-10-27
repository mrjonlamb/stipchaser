import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsPanel = ({ metrics }) => {
  const metricCards = [
    {
      id: 'active-deals',
      title: 'Active Deals',
      value: metrics?.activeDeals,
      icon: 'Car',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
      changeType: 'positive'
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      value: `${metrics?.completionRate}%`,
      icon: 'CheckCircle',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '+5.2%',
      changeType: 'positive'
    },
    {
      id: 'urgent-items',
      title: 'Urgent Items',
      value: metrics?.urgentItems,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '-3',
      changeType: 'negative'
    },
    {
      id: 'pending-docs',
      title: 'Pending Documents',
      value: metrics?.pendingDocuments,
      icon: 'FileText',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: '+8',
      changeType: 'neutral'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards?.map((metric) => (
        <div
          key={metric?.id}
          className="bg-card rounded-lg border border-border p-6 shadow-minimal hover:shadow-moderate transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${metric?.bgColor}`}>
              <Icon name={metric?.icon} size={24} className={metric?.color} />
            </div>
            <div className={`text-sm font-medium ${
              metric?.changeType === 'positive' ? 'text-accent' :
              metric?.changeType === 'negative'? 'text-error' : 'text-muted-foreground'
            }`}>
              {metric?.change}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-foreground">{metric?.value}</p>
            <p className="text-sm text-muted-foreground">{metric?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsPanel;