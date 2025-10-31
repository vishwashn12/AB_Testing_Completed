require('dotenv').config();
const https = require('https');
const fs = require('fs');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const ENABLE_HTTPS = process.env.ENABLE_HTTPS === 'true';

// Start Server
const startServer = () => {
  if (ENABLE_HTTPS && process.env.SSL_CERT_PATH && process.env.SSL_KEY_PATH) {
    // HTTPS Server (US-20)
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
    console.log(`📊 MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
  });
};

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start
startServer();

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
