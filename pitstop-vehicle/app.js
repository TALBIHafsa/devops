var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var vehiclesRouter = require('./routes/vehicles');
var app = express();

// Add more specific CORS configuration
app.use(cors({
    origin: [
        'http://localhost:8081',  // Frontend
        'http://localhost:8080',  // Alternative frontend port
        'http://localhost:3000',  // Gateway
        'http://pitstop-express-gateway:3000'  // Gateway service name inside Docker network
      ],
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true  // Allow credentials
    }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Root path handler
app.get('/', (req, res) => {
  res.json({ message: 'Vehicle Service is running' });
});

app.use('/api/vehicles', vehiclesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// subscriptions to message broker
require("./message-bus/receive/customer.added").start();
require("./message-bus/receive/customer.deleted").start();

module.exports = app;