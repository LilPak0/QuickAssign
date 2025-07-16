// PENSAR EM CRUD - CREATE, READ, UPDATE, DELETE

const {getCollection, getConnection, closeConnection} = require("../config/mongodb")

// Create Admin
async function insertAdmin (data) {
    const collection = await getCollection("admin");
    const create = await collection.insertOne(data)
    return create.insertedId
}

// Read admin
async function findAdmin (data) {
    const collection = await getCollection("admin");
    const result = await collection.findOne(data)
    return result
}

// Update admin
async function updateAdmin (filter, update) {
    const collection = await getCollection("admin");
    const result = await collection.updateOne(filter, { $set: update })
    return result
}

// Delete admin
async function deleteAdmin (data) {
    const collection = await getCollection("admin");
    await collection.deleteOne(data)
}

module.exports = { insertAdmin, findAdmin, updateAdmin, deleteAdmin }