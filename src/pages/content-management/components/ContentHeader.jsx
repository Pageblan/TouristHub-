import React from 'react';
import Button from '../../../components/ui/Button';


const ContentHeader = ({ onCreateNew, onBulkImport, onExport, selectedCount }) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
            Content Management
          </h1>
          <p className="font-body text-muted-foreground">
            Create, edit, and organize tourism content including destinations, packages, and promotional materials
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            iconName="Upload"
            iconPosition="left"
            onClick={onBulkImport}
            className="w-full sm:w-auto"
          >
            Bulk Import
          </Button>
          
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
            disabled={selectedCount === 0}
            className="w-full sm:w-auto"
          >
            Export ({selectedCount})
          </Button>
          
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateNew}
            className="w-full sm:w-auto"
          >
            Create Content
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;