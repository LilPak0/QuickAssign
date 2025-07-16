const express = require('express');
const { insertEmployee, filterEmployeesBySpecialty } = require('../services/employees');
const router = express.Router();

// 
router.post('/create', async (req, res) => {
    try {
        const data = req.body
        const create = await insertEmployee(data)

        return res.status(200).json(create)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})


router.get('/filters', async (req, res) => {
    try {
        const { speciality } = req.query
        const result = await filterEmployeesBySpecialty(speciality)
        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router;