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

// Deals router
const dealsRouter = require('./routes/deals');
app.use('/api/deals', dealsRouter);

// Loans router
const loansRouter = require('./routes/loans');
app.use('/api/loans', loansRouter);

// Units router
const unitsRouter = require('./routes/units');
app.use('/api/units', unitsRouter);

// Payments router
const paymentsRouter = require('./routes/payments');
app.use('/api/payments', paymentsRouter);

// Reports router
const reportsRouter = require('./routes/reports');
app.use('/api/reports', reportsRouter);

app.get('/', (req, res) => {
  res.send('Hello from the Real Estate Portfolio Management Suite API!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
