import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data (temporarily here, move to separate file later)
const mockProducts = [
  { id: 1, name: 'Arduino Uno', category: 'Development Boards', price: 1200, stock: 25 },
  { id: 2, name: 'Raspberry Pi 4', category: 'Single Board Computers', price: 4500, stock: 15 },
  { id: 3, name: 'NodeMCU ESP32', category: 'IoT Development', price: 850, stock: 30 }
];

const mockOrders = [
  { id: 'BE1234567890', customer: 'John Doe', date: '2024-01-15', status: 'Processing', total: 1499 },
  { id: 'BE1234567891', customer: 'Jane Smith', date: '2024-01-14', status: 'Shipped', total: 899 },
  { id: 'BE1234567892', customer: 'Mike Johnson', date: '2024-01-13', status: 'Delivered', total: 1299 }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bharat Electro Backend is running' });
});

// Export endpoints
app.get('/api/export/products', (req, res) => {
  try {
    // Convert products to CSV
    const headers = Object.keys(mockProducts[0]).join(',');
    const rows = mockProducts.map(product => 
      Object.values(product).map(field => 
        typeof field === 'string' ? `"${field}"` : field
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products-export.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export products' });
  }
});

app.get('/api/export/orders', (req, res) => {
  try {
    // Convert orders to CSV
    const headers = Object.keys(mockOrders[0]).join(',');
    const rows = mockOrders.map(order => 
      Object.values(order).map(field => 
        typeof field === 'string' ? `"${field}"` : field
      ).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders-export.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export orders' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
