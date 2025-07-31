const mockProducts = [
  { id: 1, name: 'Arduino Uno', category: 'Development Boards', price: 1200, stock: 25 },
  { id: 2, name: 'Raspberry Pi 4', category: 'Single Board Computers', price: 4500, stock: 15 },
  { id: 3, name: 'NodeMCU ESP32', category: 'IoT Development', price: 850, stock: 30 }
];

exports.handler = async (event, context) => {
  try {
    // Convert products to CSV
    const headers = Object.keys(mockProducts[0]).join(',');
    const rows = mockProducts.map(product => 
      Object.values(product).map(field => 
        typeof field === 'string' ? `"${field}"` : field
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=products-export.csv'
      },
      body: csv
    };
  } catch (error) {
    console.error('Export error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to export products' })
    };
  }
};
