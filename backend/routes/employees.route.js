const express = require('express');
const { insertEmployee, filterEmployeesBySpecialty } = require('../services/employees');
const router = express.Router();

//  POST criação de um employee
router.post('/create', async (req, res) => {
    try {
        const data = req.body
        const create = await insertEmployee(data)

        return res.status(200).json(create)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

// GET filtrar employees por especialidade
router.get('/filters', async (req, res) => {
    try {
        const { specialty } = req.body
        console.log (specialty)
        const result = await filterEmployeesBySpecialty(specialty)
        console.log(result)
        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router;