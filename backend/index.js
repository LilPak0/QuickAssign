// importar módulo Express
const express = require('express')
// definição da app
const app = express()
// porta escolhida
const port = 3033
// Aceitar JSON
app.use(express.json())
// Importar cors
const cors = require('cors')
app.use(cors());

const employeeRoutes = require('./routes/employees.route')

app.use('/api/employee', employeeRoutes);

module.exports = app;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});