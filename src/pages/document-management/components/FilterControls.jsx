import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'pay-stubs', label: 'Pay Stubs' },
    { value: 'bank-statements', label: 'Bank Statements' },
    { value: 'electric-bills', label: 'Electric Bills' },
    { value: 'identification', label: 'Identification' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-minimal">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search documents by name or type..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            placeholder="Status"
            className="w-full sm:w-40"
          />
          
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            placeholder="Category"
            className="w-full sm:w-40"
          />
          
          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={onDateFilterChange}
            placeholder="Date"
            className="w-full sm:w-40"
          />

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Search: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Status: {statusOptions?.find(opt => opt?.value === statusFilter)?.label}
                <button
                  onClick={() => onStatusFilterChange('all')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Category: {categoryOptions?.find(opt => opt?.value === categoryFilter)?.label}
                <button
                  onClick={() => onCategoryFilterChange('all')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {dateFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Date: {dateOptions?.find(opt => opt?.value === dateFilter)?.label}
                <button
                  onClick={() => onDateFilterChange('all')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;