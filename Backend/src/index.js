const express = require('express');
require('dotenv').config();

const Parse = require('./Config/parseConfig');
const app = express();

// swagger config
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load swagger yaml file
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Middleware to parse JSON body
app.use(express.json());

// Serve swagger docs at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
const userRoutes = require('./Routes/User.routes');
const eventRoutes = require('./Routes/Event.routes');
const registrationRoutes = require('./Routes/Registration.routes');
const eventStatistics= require('./Routes/EventStatistic.routes');

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/registrations', registrationRoutes);
app.use('/api/v1/statistics', eventStatistics);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
