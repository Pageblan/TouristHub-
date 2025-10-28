import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ContentEditor = ({ 
  isOpen, 
  onClose, 
  content = null, 
  onSave 
}) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: content?.title || '',
    description: content?.description || '',
    type: content?.type || 'destination',
    status: content?.status || 'draft',
    content: content?.content || `Welcome to this amazing destination!\n\nDiscover breathtaking landscapes, rich cultural heritage, and unforgettable experiences. This location offers:\n\n• Stunning natural beauty\n• Historical significance\n• Local cuisine and traditions\n• Adventure activities\n• Comfortable accommodations\n\nPlan your visit today and create memories that will last a lifetime.`,
    tags: content?.tags?.join(', ') || 'travel, tourism, adventure',
    seo_title: content?.seo_title || '',
    seo_description: content?.seo_description || '',
    featured: content?.featured || false,
    thumbnail: content?.thumbnail || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    enable_comments: content?.enable_comments ?? true,
    enable_social_sharing: content?.enable_social_sharing ?? true,
    enable_email_notifications: content?.enable_email_notifications ?? false
  });

  const [activeTab, setActiveTab] = useState('content');

  const contentTypeOptions = [
    { value: 'destination', label: 'Destination' },
    { value: 'package', label: 'Tour Package' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'activity', label: 'Activity' },
    { value: 'promotion', label: 'Promotion' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  const tabs = [
    { id: 'content', label: 'Content', icon: 'FileText' },
    { id: 'media', label: 'Media', icon: 'Image' },
    { id: 'seo', label: 'SEO', icon: 'Search' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Prepare data for database
      const contentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        status: formData.status,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        seo_title: formData.seo_title || formData.title,
        seo_description: formData.seo_description || formData.description,
        featured: formData.featured,
        thumbnail: formData.thumbnail,
        enable_comments: formData.enable_comments,
        enable_social_sharing: formData.enable_social_sharing,
        enable_email_notifications: formData.enable_email_notifications,
        author_id: user?.id,
        updated_at: new Date().toISOString()
      };

      let result;

      if (content?.id) {
        // Update existing content
        const { data, error: updateError } = await supabase
          .from('content')
          .update(contentData)
          .eq('id', content.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = data;
      } else {
        // Create new content
        contentData.created_at = new Date().toISOString();
        contentData.views = 0;
        contentData.shares = 0;
        contentData.likes = 0;
        contentData.comments_count = 0;

        const { data, error: insertError } = await supabase
          .from('content')
          .insert([contentData])
          .select()
          .single();

        if (insertError) throw insertError;
        result = data;
      }

      // Call parent callback if provided
      if (onSave) {
        onSave(result);
      }

      // Close modal
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-tourism-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-heading font-bold text-xl text-foreground">
              {content ? 'Edit Content' : 'Create New Content'}
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {content ? 'Update existing content' : 'Add new tourism content to your platform'}
            </p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} disabled={saving} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start">
              <Icon name="AlertCircle" size={20} className="text-destructive mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 p-1">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                disabled={saving}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium transition-tourism ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  value={formData?.title}
                  onChange={(e) => handleInputChange('title', e?.target?.value)}
                  placeholder="Enter content title"
                  required
                  disabled={saving}
                />
                <Select
                  label="Content Type"
                  options={contentTypeOptions}
                  value={formData?.type}
                  onChange={(value) => handleInputChange('type', value)}
                  disabled={saving}
                />
              </div>

              <Input
                label="Description"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                placeholder="Brief description of the content"
                required
                disabled={saving}
              />

              <div>
                <label className="block font-body font-medium text-foreground mb-2">
                  Content Body
                </label>
                <textarea
                  value={formData?.content}
                  onChange={(e) => handleInputChange('content', e?.target?.value)}
                  placeholder="Write your content here..."
                  rows={8}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <Input
                label="Tags"
                value={formData?.tags}
                onChange={(e) => handleInputChange('tags', e?.target?.value)}
                placeholder="travel, tourism, adventure (comma separated)"
                disabled={saving}
              />
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <label className="block font-body font-medium text-foreground mb-2">
                  Thumbnail Image
                </label>
                <div className="flex items-start space-x-4">
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={formData?.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={formData?.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e?.target?.value)}
                      placeholder="Enter image URL"
                      disabled={saving}
                    />
                    <p className="font-caption text-xs text-muted-foreground mt-1">
                      Recommended size: 400x300px
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-body font-medium text-foreground mb-2">
                  Upload Media Files
                </h3>
                <p className="font-caption text-sm text-muted-foreground mb-4">
                  Drag and drop images, videos, or documents here
                </p>
                <Button variant="outline" iconName="FolderOpen" iconPosition="left" disabled={saving}>
                  Browse Files
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <Input
                label="SEO Title"
                value={formData?.seo_title}
                onChange={(e) => handleInputChange('seo_title', e?.target?.value)}
                placeholder="Optimized title for search engines"
                disabled={saving}
              />

              <div>
                <label className="block font-body font-medium text-foreground mb-2">
                  SEO Description
                </label>
                <textarea
                  value={formData?.seo_description}
                  onChange={(e) => handleInputChange('seo_description', e?.target?.value)}
                  placeholder="Meta description for search results (150-160 characters)"
                  rows={3}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="font-caption text-xs text-muted-foreground mt-1">
                  {formData?.seo_description?.length}/160 characters
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-body font-medium text-foreground mb-2">Search Preview</h3>
                <div className="space-y-1">
                  <div className="text-primary text-sm font-medium">
                    {formData?.seo_title || formData?.title || 'Content Title'}
                  </div>
                  <div className="text-success text-xs">
                    https://tourismhub.com/content/{formData?.type}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {formData?.seo_description || formData?.description || 'Content description will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Select
                label="Publication Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
                disabled={saving}
              />

              <Checkbox
                label="Featured Content"
                description="Display this content prominently on the homepage"
                checked={formData?.featured}
                onChange={(e) => handleInputChange('featured', e?.target?.checked)}
                disabled={saving}
              />

              <div className="border border-border rounded-lg p-4">
                <h3 className="font-body font-medium text-foreground mb-3">Publishing Options</h3>
                <div className="space-y-3">
                  <Checkbox
                    label="Enable comments"
                    description="Allow users to comment on this content"
                    checked={formData?.enable_comments}
                    onChange={(e) => handleInputChange('enable_comments', e?.target?.checked)}
                    disabled={saving}
                  />
                  <Checkbox
                    label="Social media sharing"
                    description="Show social sharing buttons"
                    checked={formData?.enable_social_sharing}
                    onChange={(e) => handleInputChange('enable_social_sharing', e?.target?.checked)}
                    disabled={saving}
                  />
                  <Checkbox
                    label="Email notifications"
                    description="Notify subscribers about this content"
                    checked={formData?.enable_email_notifications}
                    onChange={(e) => handleInputChange('enable_email_notifications', e?.target?.checked)}
                    disabled={saving}
                  />
                </div>
              </div>

              {content?.id && (
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-body font-medium text-foreground mb-2">Content Analytics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Views:</span>
                      <span className="font-mono ml-2 text-foreground">{content?.views || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shares:</span>
                      <span className="font-mono ml-2 text-foreground">{content?.shares || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Likes:</span>
                      <span className="font-mono ml-2 text-foreground">{content?.likes || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Comments:</span>
                      <span className="font-mono ml-2 text-foreground">{content?.comments_count || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {content?.updated_at && (
              <>
                <span>Last saved: {new Date(content.updated_at).toLocaleString()}</span>
                <span>•</span>
              </>
            )}
            <span>{saving ? 'Saving...' : 'Ready to save'}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              iconName={saving ? "Loader" : "Save"}
              iconPosition="left" 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : (content ? 'Update Content' : 'Create Content')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;