const express = require('express');
const { insertProject, assignEmployeeToSlot, removeEmployeeFromAssignment } = require('../services/projects');
const { createProject, findProject, findAllProjects, findProjectsByStatus, updateProject, deleteProject } = require('../data/projects');
const router = express.Router();

//  POST create project
router.post('/create', async (req, res) => {
    try {
        const data = req.body
        const create = await insertProject(data)
        console.log(create)

        return res.status(200).json(create)
    } catch (err) {
        console.error(err);
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
        // Ler do URL o status (In Progress || Completed)
        const { status } = req.query
        const result = await findProjectsByStatus(status)

        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Remover projeto
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await deleteProject({ id })
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Adicionar ID ao slot vazio
router.post('/:id/assign-slot', async (req, res) => {
    try {
        const projectId = req.params.id;
        const { employeeId, specialty, slotIndex } = req.body

        const addSlot = await assignEmployeeToSlot({projectId, employeeId, specialty, slotIndex})
        return res.status(200).json(addSlot)
    } catch (err) {
        return res.status(500).json( {error: err.message })
    }
})

// Retirar ID do slot
router.post('/:projectId/unassign-slot', async (req, res) => {
  try {
    const { employeeId } = req.body;
    const { projectId } = req.params;

    const result = await removeEmployeeFromAssignment({ projectId, employeeId });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;