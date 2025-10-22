import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const DealsTable = ({ deals, onDealClick, onMessageClick, onDocumentRequest }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-warning/10 text-warning', icon: 'Clock' },
      'in-progress': { color: 'bg-primary/10 text-primary', icon: 'RotateCw' },
      'completed': { color: 'bg-accent/10 text-accent', icon: 'CheckCircle' },
      'urgent': { color: 'bg-error/10 text-error', icon: 'AlertTriangle' }
    };

    const config = statusConfig?.[status] || statusConfig?.['pending'];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)?.replace('-', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      'high': 'bg-error text-error-foreground',
      'medium': 'bg-warning text-warning-foreground',
      'low': 'bg-secondary text-secondary-foreground'
    };

    return (
      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${priorityColors?.[priority] || priorityColors?.['medium']}`}>
        {priority?.charAt(0)?.toUpperCase() + priority?.slice(1)}
      </span>
    );
  };

  const formatLastActivity = (timestamp) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activity) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-minimal overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Vehicle</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Priority</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Pending Docs</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Last Activity</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {deals?.map((deal) => (
              <tr
                key={deal?.id}
                className="hover:bg-muted/30 cursor-pointer transition-colors duration-150"
                onClick={() => onDealClick(deal)}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Image
                      src={deal?.customer?.avatar}
                      alt={deal?.customer?.avatarAlt}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{deal?.customer?.name}</p>
                      <p className="text-sm text-muted-foreground">{deal?.customer?.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-foreground">{deal?.vehicle?.year} {deal?.vehicle?.make} {deal?.vehicle?.model}</p>
                    <p className="text-sm text-muted-foreground">{deal?.vehicle?.vin}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(deal?.status)}
                </td>
                <td className="py-4 px-6">
                  {getPriorityBadge(deal?.priority)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-foreground">{deal?.pendingDocuments}</span>
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-muted-foreground">
                    {formatLastActivity(deal?.lastActivity)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2" onClick={(e) => e?.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMessageClick(deal)}
                      className="h-8 w-8"
                    >
                      <Icon name="MessageSquare" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDocumentRequest(deal)}
                      className="h-8 w-8"
                    >
                      <Icon name="FileText" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDealClick(deal)}
                      className="h-8 w-8"
                    >
                      <Icon name="ExternalLink" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {deals?.map((deal) => (
          <div
            key={deal?.id}
            className="p-4 hover:bg-muted/30 cursor-pointer transition-colors duration-150"
            onClick={() => onDealClick(deal)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Image
                  src={deal?.customer?.avatar}
                  alt={deal?.customer?.avatarAlt}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{deal?.customer?.name}</p>
                  <p className="text-sm text-muted-foreground">{deal?.customer?.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(deal?.status)}
                {getPriorityBadge(deal?.priority)}
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <p className="text-sm">
                <span className="font-medium text-foreground">Vehicle: </span>
                <span className="text-muted-foreground">{deal?.vehicle?.year} {deal?.vehicle?.make} {deal?.vehicle?.model}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-foreground">Pending Docs: </span>
                <span className="text-muted-foreground">{deal?.pendingDocuments}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-foreground">Last Activity: </span>
                <span className="text-muted-foreground">{formatLastActivity(deal?.lastActivity)}</span>
              </p>
            </div>
            
            <div className="flex justify-end gap-2" onClick={(e) => e?.stopPropagation()}>
              <Button
                variant="outline"
                size="sm"
                iconName="MessageSquare"
                iconPosition="left"
                onClick={() => onMessageClick(deal)}
              >
                Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="FileText"
                iconPosition="left"
                onClick={() => onDocumentRequest(deal)}
              >
                Docs
              </Button>
            </div>
          </div>
        ))}
      </div>
      {deals?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No deals found</p>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default DealsTable;