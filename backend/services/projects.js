const { ObjectId } = require('bson');
const { createProject, findProject, findProjectsByStatus, updateProject, deleteProject } = require('../data/projects');
const { readEmployee } = require('../data/employees');

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
        throw new Error("All fields are required: title, client, description, projectNeeds, deadline.");
    }

    /*// criação de variáveis data
    const start = new Date(projectStart);
    const end = new Date(deadline);

    if (end < start) {
        throw new Error("Invalid date");
    }
     */

    if (!Array.isArray(projectNeeds)) {
        throw new Error("teamProject deve ser um array");
    }


    const dbData = { title, client, description, projectNeeds, projectStart, deadline, projectEnd, status };

    const id = await createProject(dbData)

    return id;
}


async function assignEmployeeToSlot({ projectId, employeeId, specialty, slotIndex }) {
    // find employee
    const employee = await readEmployee({ _id: new ObjectId(String(employeeId))});
    if (!employee) {
        throw new Error("Employee not found.")
    }
    // controlar especialidade do employee e a requerida
    if (specialty !== employee.specialty) {
        throw new Error("Specialty doesn't fit")
    }
    // find Project pelo id
    const project = await findProject({ _id: new ObjectId(String(projectId)) });
    if (!project) {
        throw new Error("Project Not Found.");
    }
    // Isolar assignment
    const specialtyAssignment = project.projectNeeds.find((e) => e.specialty === specialty);
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


async function removeEmployeeFromAssignment({ projectId, employeeId }) {
  const project = await findProject({ _id: new ObjectId(String(projectId)) });
  if (!project) {
    throw new Error("Project not found.");
  }

  let updated = false;

  for (const specialtyAssignment of project.projectNeeds) {
    const index = specialtyAssignment.assigned.findIndex(id => String(id) === String(employeeId));

    if (index !== -1) {
      specialtyAssignment.assigned[index] = null;
      updated = true;
      // remove só uma vez
      break; 
    }
  }

  if (!updated) throw new Error("Funcionário não está atribuído.");

  const result = await updateProject(
    { _id: new ObjectId((String(projectId))) },
    { projectNeeds: project.projectNeeds }
  );

  return { success: true, result };
}
module.exports = { insertProject, assignEmployeeToSlot, removeEmployeeFromAssignment }