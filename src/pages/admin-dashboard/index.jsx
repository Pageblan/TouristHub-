import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/ui/AdminSidebar';
import AdminBreadcrumb from '../../components/ui/AdminBreadcrumb';
import MetricsCard from './components/MetricsCard';
import BookingChart from './components/BookingChart';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import NotificationCenter from './components/NotificationCenter';
import DataTable from './components/DataTable';
import MonitoringWidget from './components/MonitoringWidget';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const metricsData = [
    {
      title: 'Total Bookings',
      value: '2,847',
      change: 12.5,
      changeType: 'positive',
      icon: 'Calendar',
      trend: true,
      period: 'vs last month'
    },
    {
      title: 'Revenue',
      value: '$584,200',
      change: 8.3,
      changeType: 'positive',
      icon: 'DollarSign',
      trend: true,
      period: 'vs last month'
    },
    {
      title: 'Active Users',
      value: '12,456',
      change: 15.7,
      changeType: 'positive',
      icon: 'Users',
      trend: true,
      period: 'vs last month'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: -2.1,
      changeType: 'negative',
      icon: 'TrendingUp',
      trend: true,
      period: 'vs last month'
    }
  ];

  // Add mock data for missing required props
  const chartData = [
    { name: 'Jan', bookings: 400, revenue: 2400 },
    { name: 'Feb', bookings: 300, revenue: 1398 },
    { name: 'Mar', bookings: 200, revenue: 9800 },
    { name: 'Apr', bookings: 278, revenue: 3908 },
    { name: 'May', bookings: 189, revenue: 4800 },
    { name: 'Jun', bookings: 239, revenue: 3800 }
  ];

  const activities = [
    { id: 1, type: 'booking', message: 'New booking received', timestamp: new Date() },
    { id: 2, type: 'user', message: 'New user registered', timestamp: new Date() },
    { id: 3, type: 'payment', message: 'Payment processed', timestamp: new Date() }
  ];

  const quickActions = [
    { 
      id: 1, 
      title: 'Add New Tour', 
      description: 'Create new tour packages',
      icon: 'Plus', 
      path: '/tour-package-details',
      color: 'bg-primary/10 text-primary',
      count: null
    },
    { 
      id: 2, 
      title: 'View Reports', 
      description: 'Analyze performance data',
      icon: 'FileText', 
      path: '/admin-dashboard',
      color: 'bg-accent/10 text-accent',
      count: 24
    },
    { 
      id: 3, 
      title: 'Manage Users', 
      description: 'View and manage user accounts',
      icon: 'Users', 
      path: '/tourist-dashboard',
      color: 'bg-success/10 text-success',
      count: 1247
    },
    { 
      id: 4, 
      title: 'Content Management', 
      description: 'Update destinations and packages',
      icon: 'Settings', 
      path: '/content-management',
      color: 'bg-warning/10 text-warning',
      count: 12
    }
  ];

  const notifications = [
    { id: 1, title: 'System Update', message: 'New features available', type: 'info', read: false },
    { id: 2, title: 'Low Stock Alert', message: 'Tour capacity running low', type: 'warning', read: false }
  ];

  const monitoringWidgets = [
    { id: 1, title: 'Server Status', status: 'online', value: '99.9%' },
    { id: 2, title: 'Database', status: 'online', value: '156ms' }
  ];

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', bookings: 5, status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', bookings: 3, status: 'active' }
  ];

  const tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'status', label: 'Status' }
  ];

  const breadcrumbs = [
    { label: 'Admin', path: '/admin-dashboard', icon: 'Home' },
    { label: 'Dashboard', path: '/admin-dashboard', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <AdminBreadcrumb customBreadcrumbs={breadcrumbs} />
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground font-body">
                  Welcome back! Here's what's happening with your tourism platform today.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Time</p>
                  <p className="font-mono text-foreground">
                    {currentTime?.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
                <Button variant="default" iconName="RefreshCw" size="sm">
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                trend={metric?.trend}
                period={metric?.period}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BookingChart 
              type="bar" 
              title="Monthly Bookings" 
              height={350}
              data={chartData}
            />
            <BookingChart 
              type="line" 
              title="Revenue Trends" 
              height={350}
              data={chartData}
            />
          </div>

          {/* Activity and Actions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ActivityFeed activities={activities} />
            </div>
            <div>
              <QuickActions actions={quickActions} />
            </div>
          </div>

          {/* Notifications and Monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <NotificationCenter notifications={notifications} />
            <MonitoringWidget widgets={monitoringWidgets} />
          </div>

          {/* Data Table */}
          <div className="mb-8">
            <DataTable data={tableData} columns={tableColumns} title="Recent Users" />
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>© {new Date()?.getFullYear()} TourismHub Admin</span>
                <span>•</span>
                <span>System Status: All systems operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span>Secure Connection</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;