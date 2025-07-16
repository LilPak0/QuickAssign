const { createProject, findProject, findProjectsByStatus, updateProject, deleteProject } = require('../data/projects')

async function insertProject (data) {
    const { title, client, description, teamProject, projectStart, estimatedEnd } = data

    let projectEnd = null;
    let status = "In progress";

    // confirmação se não há campos vazios
    if (!title || !client || !description || !teamProject || !projectStart || !estimatedEnd) {
        throw new Error("There is blank spaces");
    }

    // criação de variáveis data
    const start = new Date(projectStart);
    const end = new Date(estimatedEnd);

    if (end < start) {
        throw new Error("Invalid date");
    }
    
    if (!Array.isArray(teamProject)) {
        throw new Error("teamProject deve ser um array");
    }


    const dbData = { title, client, description, teamProject, projectStart, estimatedEnd, projectEnd, status };

    const id = await createProject(dbData)

    return id;
}

module.exports = { insertProject }