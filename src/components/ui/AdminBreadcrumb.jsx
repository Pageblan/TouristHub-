import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const AdminBreadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [
      { label: 'Admin', path: '/admin-dashboard', icon: 'Home' }
    ];

    // Map path segments to readable labels
    const pathMap = {
      'admin-dashboard': { label: 'Dashboard', icon: 'BarChart3' },
      'content-management': { label: 'Content Management', icon: 'FileText' }
    };

    pathSegments?.forEach((segment, index) => {
      if (segment !== 'admin-dashboard' && pathMap?.[segment]) {
        const path = '/' + pathSegments?.slice(0, index + 1)?.join('/');
        breadcrumbs?.push({
          label: pathMap?.[segment]?.label,
          path: path,
          icon: pathMap?.[segment]?.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm font-body mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => {
          const isLast = index === breadcrumbs?.length - 1;
          
          return (
            <li key={crumb?.path} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={14} 
                  className="text-muted-foreground mx-2" 
                />
              )}
              {isLast ? (
                <span className="flex items-center space-x-1 text-foreground font-medium">
                  <Icon name={crumb?.icon} size={16} />
                  <span>{crumb?.label}</span>
                </span>
              ) : (
                <Link
                  to={crumb?.path}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-tourism"
                >
                  <Icon name={crumb?.icon} size={16} />
                  <span>{crumb?.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumb;