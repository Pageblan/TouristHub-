import React from 'react';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ContentPreview = ({ 
  isOpen, 
  onClose, 
  content 
}) => {
  if (!isOpen || !content) return null;

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-success text-success-foreground', label: 'Published' },
      draft: { color: 'bg-warning text-warning-foreground', label: 'Draft' },
      archived: { color: 'bg-muted text-muted-foreground', label: 'Archived' },
      pending: { color: 'bg-accent text-accent-foreground', label: 'Pending' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-tourism-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name={getContentTypeIcon(content?.type)} size={24} className="text-primary" />
            <div>
              <h2 className="font-heading font-bold text-xl text-foreground">
                Content Preview
              </h2>
              <p className="font-body text-sm text-muted-foreground">
                Preview how this content will appear to users
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" iconName="ExternalLink" iconPosition="left">
              Open in New Tab
            </Button>
            <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
          </div>
        </div>

        {/* Content Preview */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Hero Section */}
          <div className="relative h-64 bg-muted">
            <Image
              src={content?.thumbnail}
              alt={content?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusBadge(content?.status)}
                  {content?.featured && (
                    <span className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="font-heading font-bold text-3xl mb-2">{content?.title}</h1>
                <p className="font-body text-lg opacity-90">{content?.description}</p>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={16} />
                  <span>By {content?.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} />
                  <span>Modified {formatDate(content?.lastModified)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Tag" size={16} />
                  <span>{content?.tags?.join(', ') || 'No tags'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Eye" size={16} />
                  <span>1,234 views</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="prose prose-lg max-w-none">
                <div className="font-body text-foreground leading-relaxed whitespace-pre-line">
                  {content?.content}
                </div>
              </div>

              {/* Tags */}
              {content?.tags && content?.tags?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {content?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-tourism cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Information */}
              {(content?.seoTitle || content?.seoDescription) && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-3">SEO Information</h3>
                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    {content?.seoTitle && (
                      <div>
                        <label className="font-body font-medium text-sm text-foreground">SEO Title:</label>
                        <p className="font-body text-muted-foreground">{content?.seoTitle}</p>
                      </div>
                    )}
                    {content?.seoDescription && (
                      <div>
                        <label className="font-body font-medium text-sm text-foreground">SEO Description:</label>
                        <p className="font-body text-muted-foreground">{content?.seoDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related Actions */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" iconName="Heart" iconPosition="left">
                    Like (89)
                  </Button>
                  <Button variant="outline" size="sm" iconName="Share" iconPosition="left">
                    Share (56)
                  </Button>
                  <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
                    Comments (23)
                  </Button>
                  <Button variant="outline" size="sm" iconName="Bookmark" iconPosition="left">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50">
          <div className="text-sm text-muted-foreground">
            This is a preview of how the content will appear to users
          </div>
          <Button variant="default" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;