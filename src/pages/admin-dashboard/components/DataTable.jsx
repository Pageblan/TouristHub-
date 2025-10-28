import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DataTable = ({ data, columns, title, exportable = true }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const defaultData = [
    {
      id: 1,
      destination: 'Bali, Indonesia',
      bookings: 234,
      revenue: '$47,800',
      rating: 4.8,
      status: 'active',
      lastUpdated: '2024-09-14'
    },
    {
      id: 2,
      destination: 'Tokyo, Japan',
      bookings: 189,
      revenue: '$52,300',
      rating: 4.9,
      status: 'active',
      lastUpdated: '2024-09-13'
    },
    {
      id: 3,
      destination: 'Paris, France',
      bookings: 156,
      revenue: '$38,900',
      rating: 4.6,
      status: 'active',
      lastUpdated: '2024-09-12'
    },
    {
      id: 4,
      destination: 'Maldives',
      bookings: 98,
      revenue: '$89,200',
      rating: 4.9,
      status: 'featured',
      lastUpdated: '2024-09-11'
    },
    {
      id: 5,
      destination: 'Swiss Alps',
      bookings: 67,
      revenue: '$34,500',
      rating: 4.7,
      status: 'inactive',
      lastUpdated: '2024-09-10'
    },
    {
      id: 6,
      destination: 'Iceland',
      bookings: 45,
      revenue: '$28,700',
      rating: 4.8,
      status: 'active',
      lastUpdated: '2024-09-09'
    }
  ];

  const defaultColumns = [
    { key: 'destination', label: 'Destination', sortable: true },
    { key: 'bookings', label: 'Bookings', sortable: true },
    { key: 'revenue', label: 'Revenue', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'lastUpdated', label: 'Last Updated', sortable: true }
  ];

  const tableData = data || defaultData;
  const tableColumns = columns || defaultColumns;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...tableData]?.sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a?.[sortField];
    let bVal = b?.[sortField];
    
    if (typeof aVal === 'string' && aVal?.includes('$')) {
      aVal = parseFloat(aVal?.replace(/[$,]/g, ''));
      bVal = parseFloat(bVal?.replace(/[$,]/g, ''));
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-success/10 text-success border-success/20',
      inactive: 'bg-muted text-muted-foreground border-border',
      featured: 'bg-accent/10 text-accent border-accent/20'
    };
    return badges?.[status] || badges?.active;
  };

  const renderCellContent = (item, column) => {
    const value = item?.[column?.key];
    
    if (column?.key === 'status') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-caption border ${getStatusBadge(value)}`}>
          {value}
        </span>
      );
    }
    
    if (column?.key === 'rating') {
      return (
        <div className="flex items-center space-x-1">
          <Icon name="Star" size={14} className="text-accent fill-current" />
          <span className="font-mono text-sm">{value}</span>
        </div>
      );
    }
    
    return value;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-tourism">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {title || "Top Performing Destinations"}
          </h3>
          <div className="flex items-center space-x-2">
            {exportable && (
              <Button variant="outline" size="sm" iconName="Download">
                Export
              </Button>
            )}
            <Button variant="ghost" size="sm" iconName="Filter">
              Filter
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {tableColumns?.map((column) => (
                <th 
                  key={column?.key}
                  className={`px-6 py-3 text-left text-xs font-caption font-medium text-muted-foreground uppercase tracking-wider ${
                    column?.sortable ? 'cursor-pointer hover:text-foreground' : ''
                  }`}
                  onClick={column?.sortable ? () => handleSort(column?.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    {column?.sortable && (
                      <Icon 
                        name={
                          sortField === column?.key 
                            ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown')
                            : 'ChevronsUpDown'
                        } 
                        size={12} 
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map((item, index) => (
              <tr 
                key={item?.id} 
                className="hover:bg-muted/30 transition-tourism"
              >
                {tableColumns?.map((column) => (
                  <td key={column?.key} className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-body text-foreground">
                      {renderCellContent(item, column)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData?.length)} of {sortedData?.length} results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                iconName="ChevronLeft"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;