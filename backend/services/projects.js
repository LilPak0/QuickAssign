const { ObjectId } = require('bson');
const { createProject, findProject, findProjectsByStatus, updateProject, deleteProject } = require('../data/projects')

/* {
  _id: ObjectId("..."),
  title: "Novo App",
  client,
  projectStart
  description: "Aplicação de gestão",
  projectNeeds: [
    {
      specialty: "frontend",
      slots: 3,
      assigned: [null, null, null]
    },
    {
      specialty: "backend",
      slots: 2,
      assigned: [null, null]
    }
  ]
}
 */

async function insertProject (data) {
    const { title, client, description, projectNeeds, deadline } = data

    let projectStart = null;
    let projectEnd = null;
    let status = "In progress";

    // confirmação se não há campos vazios
    if (!title || !client || !description || !projectNeeds || !deadline) {
        throw new Error("There is blank spaces");
    }

    // criação de variáveis data
    const start = new Date(projectStart);
    const end = new Date(deadline);

    if (end < start) {
        throw new Error("Invalid date");
    }
    
    if (!Array.isArray(projectNeeds)) {
        throw new Error("teamProject deve ser um array");
    }


    const dbData = { title, client, description, projectNeeds, projectStart, deadline, projectEnd, status };

    const id = await createProject(dbData)

    return id;
}


async function assignEmployeeToSlot({ projectId, employeeId, specialty, slotIndex }) {
    // find Project pelo id
    const project = await findProject({ _id: new ObjectId(String(projectId)) });

    if (!project) {
        throw new Error("Project Not Found.");
    }

    // Isolar assignment
    const specialtyAssignment = project.projectNeeds.find(e => e.specialty === specialty);
    if (!specialtyAssignment) {
        throw new Error("Invalid Specialty.")
    }

    // Encontrar o intervalo
    if (slotIndex < 0 || slotIndex >= specialtyAssignment.slots) {
        throw new Error("Slot index invalid");
    }
    // Se employee já estiver atribuído no array de assigned, não aceitar
    if (specialtyAssignment.assigned.includes(employeeId)) {
        throw new Error("Employee already assigned");
    }
    // Se slot já estiver ocupado
    if (specialtyAssignment.assigned[slotIndex] !== null) {
        throw new Error("Este slot já está ocupado.");
    }

    // Atualizar slot com o employee
    specialtyAssignment.assigned[slotIndex] = employeeId;

    // Atualizar no DB
    const assignedEmployee = await updateProject (  
        { _id: new ObjectId(String(projectId)) },
        { projectNeeds: project.projectNeeds }
    )
    

    return { success: true, assignedEmployee };
}
module.exports = { insertProject, assignEmployeeToSlot }