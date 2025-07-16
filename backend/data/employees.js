// CRUD - CREATE, READ, UPDATE, DELETE

const {getCollection, getConnection, closeConnection} = require("../config/mongodb")

// Create Employee
async function createEmployee (data) {
    const collection = await getCollection("employee");
    const create = await collection.insertOne(data)
    return create.insertedId
}

// Read Employee
async function findEmployee (data) {
    const collection = await getCollection("employee");
    const result = await collection.findOne(data)
    return result
}

// Read Employees by Especialty
async function findEmployeesBySpecialty (specialty) {
    const collection = await getCollection("employee");
    const result = await collection.find({ speciality: specialty}).toArray()
    return result
}

// Update Employee
async function updateEmployee (filter, update) {
    const collection = await getCollection("employee");
    const result = await collection.updateOne(filter, { $set: update })
    return result
}

// Delete Employee
async function deleteEmployee (data) {
    const collection = await getCollection("employee");
    await collection.deleteOne(data)
}

module.exports = { createEmployee, findEmployee, updateEmployee, deleteEmployee, findEmployeesBySpecialty }

/*
// Count users checked-in
async function countUsersCheckedIn() {
    const collection = await getCollection("user");
    const count = await collection.find({ paymentToken: true }).toArray();
    return count.length;
} */