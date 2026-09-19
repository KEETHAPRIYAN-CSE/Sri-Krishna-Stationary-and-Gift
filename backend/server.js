import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Sri Krishna Stationery and Gift - API Server`);
  console.log(` Running on port: http://localhost:${PORT}`);
  console.log(` Healthcheck:    http://localhost:${PORT}/api/health`);
  console.log(` Environment:    ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});
