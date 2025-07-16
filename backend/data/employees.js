// CRUD - CREATE, READ, UPDATE, DELETE

const {getCollection, getConnection, closeConnection} = require("../config/mongodb")

// Create Employee
async function createEmployee (data) {
    const collection = await getCollection("employees");
    const create = await collection.insertOne(data)
    return create.insertedId
}

// Read Employee
async function findEmployee (data) {
    const collection = await getCollection("employees");
    const result = await collection.findOne(data)
    return result
}

// Read Employees by Especialty
async function findEmployeesBySpecialty (specialty) {
    const collection = await getCollection("employees");
    const result = await collection.find({ specialty: specialty}).toArray()
    return result
}

async function findEmployeesByExperience (experience) {
    const collection = await getCollection("employees");
    const result = await collection.find({ experience: experience}).toArray()
    return result
}

// Update Employee
async function updateEmployee (filter, update) {
    const collection = await getCollection("employees");
    const result = await collection.updateOne(filter, { $set: update })
    return result
}

// Delete Employee
async function deleteEmployee (data) {
    const collection = await getCollection("employees");
    await collection.deleteOne(data)
}

module.exports = { createEmployee, findEmployee, updateEmployee, deleteEmployee, findEmployeesBySpecialty, findEmployeesByExperience }

