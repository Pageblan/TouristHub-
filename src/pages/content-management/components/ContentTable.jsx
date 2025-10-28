import React from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ContentTable = ({ 
  content, 
  selectedItems, 
  onSelectItem, 
  onSelectAll, 
  onEdit, 
  onDelete, 
  onPreview,
  onStatusChange 
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-success text-success-foreground', label: 'Published' },
      draft: { color: 'bg-warning text-warning-foreground', label: 'Draft' },
      archived: { color: 'bg-muted text-muted-foreground', label: 'Archived' },
      pending: { color: 'bg-accent text-accent-foreground', label: 'Pending' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getContentTypeIcon = (type) => {
    const iconMap = {
      destination: 'MapPin',
      package: 'Package',
      hotel: 'Building',
      activity: 'Activity',
      promotion: 'Megaphone'
    };
    return iconMap?.[type] || 'FileText';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedItems?.length === content?.length && content?.length > 0}
                  indeterminate={selectedItems?.length > 0 && selectedItems?.length < content?.length}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="p-4 text-left font-heading font-semibold text-foreground">Content</th>
              <th className="p-4 text-left font-heading font-semibold text-foreground">Type</th>
              <th className="p-4 text-left font-heading font-semibold text-foreground">Status</th>
              <th className="p-4 text-left font-heading font-semibold text-foreground">Author</th>
              <th className="p-4 text-left font-heading font-semibold text-foreground">Modified</th>
              <th className="p-4 text-left font-heading font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {content?.map((item) => (
              <tr key={item?.id} className="border-b border-border hover:bg-muted/50 transition-tourism">
                <td className="p-4">
                  <Checkbox
                    checked={selectedItems?.includes(item?.id)}
                    onChange={(e) => onSelectItem(item?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item?.thumbnail}
                        alt={item?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-body font-medium text-foreground">{item?.title}</h3>
                      <p className="font-caption text-sm text-muted-foreground line-clamp-1">
                        {item?.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getContentTypeIcon(item?.type)} size={16} className="text-muted-foreground" />
                    <span className="font-body text-sm text-foreground capitalize">{item?.type}</span>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(item?.status)}
                </td>
                <td className="p-4">
                  <span className="font-body text-sm text-foreground">{item?.author}</span>
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-muted-foreground">
                    {formatDate(item?.lastModified)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onPreview(item)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEdit(item)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onDelete(item)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {content?.map((item) => (
          <div key={item?.id} className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-start space-x-3 mb-3">
              <Checkbox
                checked={selectedItems?.includes(item?.id)}
                onChange={(e) => onSelectItem(item?.id, e?.target?.checked)}
                className="mt-1"
              />
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item?.thumbnail}
                  alt={item?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-body font-medium text-foreground mb-1">{item?.title}</h3>
                <p className="font-caption text-sm text-muted-foreground line-clamp-2 mb-2">
                  {item?.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name={getContentTypeIcon(item?.type)} size={12} />
                    <span className="capitalize">{item?.type}</span>
                  </div>
                  <span>{item?.author}</span>
                  <span>{formatDate(item?.lastModified)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              {getStatusBadge(item?.status)}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Eye"
                  onClick={() => onPreview(item)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Edit"
                  onClick={() => onEdit(item)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => onDelete(item)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {content?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
            No content found
          </h3>
          <p className="font-body text-muted-foreground">
            Try adjusting your filters or create new content to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentTable;