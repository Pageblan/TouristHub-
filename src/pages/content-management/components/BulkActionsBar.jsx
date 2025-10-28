import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';


const BulkActionsBar = ({ 
  selectedCount, 
  onBulkAction, 
  onClearSelection,
  isVisible 
}) => {
  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'publish', label: 'Publish Selected' },
    { value: 'unpublish', label: 'Unpublish Selected' },
    { value: 'archive', label: 'Archive Selected' },
    { value: 'delete', label: 'Delete Selected' },
    { value: 'duplicate', label: 'Duplicate Selected' }
  ];

  const [selectedAction, setSelectedAction] = React.useState('');

  const handleApplyAction = () => {
    if (selectedAction && selectedCount > 0) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card border border-border rounded-lg shadow-tourism-lg p-4 min-w-96">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-primary-foreground">
                {selectedCount}
              </span>
            </div>
            <span className="font-body font-medium text-foreground">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Select
              options={bulkActionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Choose action..."
              className="min-w-48"
            />
            
            <Button
              variant="default"
              size="sm"
              iconName="Play"
              iconPosition="left"
              onClick={handleApplyAction}
              disabled={!selectedAction}
            >
              Apply
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;