// CRUD - CREATE, READ, UPDATE, DELETE

const {getCollection, getConnection, closeConnection} = require("./mongodb")

// Create Projects
async function createProject (data) {
    const collection = await getCollection("projects");
    const create = await collection.insertOne(data)
    return create.insertedId
}

// Read Projects
async function findProject (data) {
    const collection = await getCollection("projects");
    const result = await collection.findOne(data)
    return result
}

// Read projects by Status
async function findProjectsByStatus (status) {
    const collection = await getCollection("projects");
    const result = await collection.find({ status: status}).toArray()
    return result
}

// Update projects
async function updateProject (filter, update) {
    const collection = await getCollection("projects");
    const result = await collection.updateOne(filter, { $set: update })
    return result
}

// Delete projects
async function deleteProject (data) {
    const collection = await getCollection("projects");
    await collection.deleteOne(data)
}

module.exports = { createProject, findProject, findProjectsByStatus, updateProject, deleteProject }

/*
// Count users checked-in
async function countUsersCheckedIn() {
    const collection = await getCollection("user");
    const count = await collection.find({ paymentToken: true }).toArray();
    return count.length;
} */