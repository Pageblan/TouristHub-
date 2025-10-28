import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const BookingChart = ({ type = 'bar', data, title, height = 300 }) => {
  const chartData = data || [
    { month: 'Jan', bookings: 245, revenue: 48500 },
    { month: 'Feb', bookings: 312, revenue: 62400 },
    { month: 'Mar', bookings: 189, revenue: 37800 },
    { month: 'Apr', bookings: 428, revenue: 85600 },
    { month: 'May', bookings: 356, revenue: 71200 },
    { month: 'Jun', bookings: 492, revenue: 98400 },
    { month: 'Jul', bookings: 578, revenue: 115600 },
    { month: 'Aug', bookings: 634, revenue: 126800 },
    { month: 'Sep', bookings: 445, revenue: 89000 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-tourism">
          <p className="font-body text-sm text-foreground">{`Month: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="font-mono text-sm" style={{ color: entry?.color }}>
              {`${entry?.dataKey}: ${entry?.value?.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-tourism">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          {type === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="bookings" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-accent)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingChart;