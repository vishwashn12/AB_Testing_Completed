require('dotenv').config();
const https = require('https');
const fs = require('fs');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const ENABLE_HTTPS = process.env.ENABLE_HTTPS === 'true';

// Start Server
const startServer = () => {
  if (ENABLE_HTTPS && process.env.SSL_CERT_PATH && process.env.SSL_KEY_PATH) {
    // HTTPS Server
    try {
      const httpsOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      };

      https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`🔒 HTTPS Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      });
    } catch (error) {
      console.error('❌ HTTPS setup failed:', error.message);
      console.log('⚠️ Falling back to HTTP...');
      startHTTPServer();
    }
  } else {
    startHTTPServer();
  }
};

const startHTTPServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 HTTP Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
};

// Graceful Shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  // Close server and database connections
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle Uncaught Exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

module.exports = app;
