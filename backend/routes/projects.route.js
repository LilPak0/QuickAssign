const express = require('express');
const { insertProject } = require('../services/projects');
const { createProject, findProject, findAllProjects, findProjectsByStatus, updateProject, deleteProject } = require('../data/projects');
const router = express.Router();

//  POST create project
router.post('/create', async (req, res) => {
    try {
        const data = req.body
        const create = await insertProject(data)

        return res.status(200).json(create)
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
})

// GET all projects
router.get('/all', async (req, res) => {
    try {
        const result = await findAllProjects()
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

// GET filtrar projects by status
router.get('/filters', async (req, res) => {
    try {
        const { status } = req.body
        const result = await findProjectsByStatus(status)

        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await deleteProject({ id })
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router;