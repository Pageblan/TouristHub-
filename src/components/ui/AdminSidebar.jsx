import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const AdminSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const location = useLocation();

  const toggleSection = (sectionKey) => {
    if (isCollapsed) return;
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev?.[sectionKey]
    }));
  };

  const navigationSections = [
    {
      key: 'overview',
      title: 'Overview',
      icon: 'BarChart3',
      items: [
        {
          name: 'Dashboard',
          path: '/admin-dashboard',
          icon: 'Home',
          description: 'Platform metrics'
        }
      ]
    },
    {
      key: 'content',
      title: 'Content',
      icon: 'FileText',
      items: [
        {
          name: 'Management',
          path: '/content-management',
          icon: 'Settings',
          description: 'Manage destinations'
        }
      ]
    }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const Logo = () => (
    <Link to="/admin-dashboard" className="flex items-center space-x-3 p-4 transition-tourism hover:opacity-80">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon name="Shield" size={20} color="white" strokeWidth={2.5} />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="font-heading font-bold text-lg text-foreground">TourismHub</span>
          <span className="font-caption text-xs text-muted-foreground">Admin Panel</span>
        </div>
      )}
    </Link>
  );

  return (
    <aside className={`fixed left-0 top-0 h-full bg-card border-r border-border shadow-tourism-lg z-40 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border">
          <Logo />
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 m-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-tourism"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2">
            {navigationSections?.map((section) => (
              <div key={section?.key} className="px-3">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(section?.key)}
                    className="w-full flex items-center justify-between p-2 text-sm font-caption font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-tourism"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name={section?.icon} size={16} />
                      <span>{section?.title}</span>
                    </div>
                    <Icon 
                      name="ChevronDown" 
                      size={14} 
                      className={`transition-transform ${
                        expandedSections?.[section?.key] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}

                <div className={`space-y-1 ${
                  isCollapsed ? '' : expandedSections?.[section?.key] ? 'mt-2' : 'hidden'
                }`}>
                  {section?.items?.map((item) => (
                    <Link
                      key={item?.name}
                      to={item?.path}
                      className={`flex items-center space-x-3 p-2 rounded-lg font-body transition-tourism group ${
                        isActivePath(item?.path)
                          ? 'text-primary bg-primary/10 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      } ${isCollapsed ? 'justify-center' : 'ml-4'}`}
                      title={isCollapsed ? `${section?.title} - ${item?.name}` : ''}
                    >
                      <Icon 
                        name={item?.icon} 
                        size={18} 
                        strokeWidth={isActivePath(item?.path) ? 2.5 : 2}
                      />
                      {!isCollapsed && (
                        <div className="flex flex-col">
                          <span className="font-medium">{item?.name}</span>
                          <span className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                            {item?.description}
                          </span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="User" size={16} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-body font-medium text-sm text-foreground">Admin User</span>
                <span className="font-caption text-xs text-muted-foreground">System Administrator</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;