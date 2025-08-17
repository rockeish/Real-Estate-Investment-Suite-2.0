require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const propertiesRouter = require('./routes/properties');
const tenantsRouter = require('./routes/tenants');

app.use('/api/properties', propertiesRouter);
app.use('/api/tenants', tenantsRouter);

const leasesRouter = require('./routes/leases');
app.use('/api/leases', leasesRouter);

const transactionsRouter = require('./routes/transactions');
app.use('/api/transactions', transactionsRouter);

app.get('/', (req, res) => {
  res.send('Hello from the Real Estate Portfolio Management Suite API!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
