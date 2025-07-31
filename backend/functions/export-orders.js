const mockOrders = [
  { id: 'BE1234567890', customer: 'John Doe', date: '2024-01-15', status: 'Processing', total: 1499 },
  { id: 'BE1234567891', customer: 'Jane Smith', date: '2024-01-14', status: 'Shipped', total: 899 },
  { id: 'BE1234567892', customer: 'Mike Johnson', date: '2024-01-13', status: 'Delivered', total: 1299 }
];

exports.handler = async (event, context) => {
  try {
    // Convert orders to CSV
    const headers = Object.keys(mockOrders[0]).join(',');
    const rows = mockOrders.map(order => 
      Object.values(order).map(field => 
        typeof field === 'string' ? `"${field}"` : field
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=orders-export.csv'
      },
      body: csv
    };
  } catch (error) {
    console.error('Export error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to export orders' })
    };
  }
};
