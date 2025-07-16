const express = require('express');
const { insertEmployee, filterEmployeesBySpecialty } = require('../services/employees');
const { findAllEmployees } = require('../data/employees');
const router = express.Router();

// POST criação de um employee
router.post('/create', async (req, res) => {
    try {
        const data = req.body
        const create = await insertEmployee(data)

        return res.status(200).json(create)
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
})

// GET all employees
router.get('/allemployees', async (req, res) => {
    try {
        const result = await findAllEmployees()
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

// GET filtrar employees por especialidade e experiencia
router.post('/filters', async (req, res) => {
  try {
    // Usa direto o body como input
    const result = await filterEmployees(req.body); 
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;