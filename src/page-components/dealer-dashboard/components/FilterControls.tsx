import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const FilterControls = ({ filters, onFilterChange, onSearch, onNewDeal }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending Documents' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const staffOptions = [
    { value: 'all', label: 'All Staff' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'mike-chen', label: 'Mike Chen' },
    { value: 'lisa-rodriguez', label: 'Lisa Rodriguez' },
    { value: 'david-kim', label: 'David Kim' }
  ];

  const urgencyOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-minimal">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search deals, customers, or vehicles..."
              value={filters?.search}
              onChange={(e) => onSearch(e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => onFilterChange('status', value)}
              placeholder="Filter by status"
              className="min-w-[160px]"
            />
            
            <Select
              options={urgencyOptions}
              value={filters?.urgency}
              onChange={(value) => onFilterChange('urgency', value)}
              placeholder="Filter by priority"
              className="min-w-[160px]"
            />
            
            <Select
              options={staffOptions}
              value={filters?.assignedStaff}
              onChange={(value) => onFilterChange('assignedStaff', value)}
              placeholder="Filter by staff"
              className="min-w-[160px]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={() => window.location?.reload()}
          >
            Refresh
          </Button>
          
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={onNewDeal}
          >
            New Deal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;