const config = require('../config');

function authenticateDashboard(req, res, next) {
  const token = req.headers['x-dashboard-token'] || req.query.token;

  if (!token || token !== config.dashboard.token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

module.exports = { authenticateDashboard };
