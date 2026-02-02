const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');

const whatsappRoutes = require('./routes/whatsapp');
const dashboardRoutes = require('./routes/dashboard');
const { authenticateDashboard } = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Our Two Cents API',
    status: 'running',
    endpoints: {
      whatsapp: '/webhook/whatsapp',
      dashboard: '/api/dashboard/*',
    }
  });
});

app.use('/webhook', whatsappRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Our Two Cents backend running on port ${PORT}`);
  console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/overview`);
});
