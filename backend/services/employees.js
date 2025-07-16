const { createEmployee, readEmployee, findEmployees, findAllEmployees, findEmployeesBySpecialty, findEmployeesByExperience, updateEmployee, deleteEmployee, findEmployeesByProperty, findEmployees } = require('../data/employees')

const specialties = [ "Frontend Developer", "Backend Developer", "Designer UX/UI", "DevOps Engineer", "Data Analyst", "Business Analyst", "QA Engineer/Tester" ]

// inserir employee na DB
async function insertEmployee (data) {
    // informação a receber do frontEnd
    const { firstName, lastName, birthDate, email, specialty, experience, skills, projects } = data

    // verificar se especialidade é válida
    if (!specialties.includes(specialty)) {
        throw new Error("Invalid Specialty");
    }

    // toda a info para a DB
    const employeeInfo = { firstName, lastName, birthDate, email, specialty, experience, skills, projects }

    // confirmação se não há campos vazios
    if ( !email || !firstName || !lastName || !birthDate || !specialty || !experience || !skills ) {
        throw new Error("There are blank or missing fields");
    }
    // skills deve ser um array
    if (!Array.isArray(skills)) {
        throw new Error("Skills must be an array");
    }
    // projects deve ser um array de objetos
    if (!Array.isArray(projects)) {
        throw new Error("Projects must be an array");
    }

    // experience deve ser um numero e maior que 0
    if (typeof experience !== "string" || experience < 0) {
        throw new Error("Invalid experience value");
    }

    // se passar todas as confirmações, executa a função
    const id = await createEmployee(employeeInfo);

    return id;
}


// filtrar funcionários por especialidade
async function filterEmployeesByProperty (property) {
    if(!property) {
        throw new Error ("Invalid Specialty")
    }
    const result = await findEmployeesByProperty(property)
    return result
}



// filtrar por especialidade e experiencia (opcional)
async function filterEmployees({ specialty, experience }) {
    const filters = {};

    if (specialty) {
        filters.specialty = specialty;
    }

    if (experience !== undefined) {
        filters.experience = experience;
    } 

  // Se nenhum filtro for passado, retornar todos
  const result = Object.keys(filters).length === 0
    ? await findAllEmployees()
    : await findEmployees(filters);

  return result;
}



module.exports = { insertEmployee, filterEmployeesByProperty, filterEmployees }