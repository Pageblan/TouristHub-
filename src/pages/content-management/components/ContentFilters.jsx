import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ContentFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  contentStats 
}) => {
  const contentTypeOptions = [
    { value: 'all', label: 'All Content Types' },
    { value: 'destination', label: 'Destinations' },
    { value: 'package', label: 'Tour Packages' },
    { value: 'hotel', label: 'Hotels' },
    { value: 'activity', label: 'Activities' },
    { value: 'promotion', label: 'Promotions' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
    { value: 'pending', label: 'Pending Review' }
  ];

  const authorOptions = [
    { value: 'all', label: 'All Authors' },
    { value: 'admin', label: 'Admin User' },
    { value: 'content-manager', label: 'Content Manager' },
    { value: 'editor', label: 'Editor' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          Filter & Search Content
        </h2>
        
        <div className="flex items-center gap-4 text-sm font-body text-muted-foreground">
          <span>Total: {contentStats?.total}</span>
          <span>Published: {contentStats?.published}</span>
          <span>Draft: {contentStats?.draft}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Content Type"
          options={contentTypeOptions}
          value={filters?.contentType}
          onChange={(value) => onFilterChange('contentType', value)}
        />
        
        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />
        
        <Select
          label="Author"
          options={authorOptions}
          value={filters?.author}
          onChange={(value) => onFilterChange('author', value)}
        />
        
        <Input
          label="Date Range"
          type="date"
          value={filters?.dateFrom}
          onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search content by title, description, or tags..."
            value={filters?.search}
            onChange={(e) => onFilterChange('search', e?.target?.value)}
          />
        </div>
        
        <Button
          variant="outline"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default ContentFilters;