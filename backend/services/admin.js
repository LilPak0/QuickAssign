const { insertAdmin, findAdmin, updateAdmin, deleteAdmin } = require('../data/admin')

const { addToken } = require('./authToken');

// Função criar Admin
async function createAdmin(data) {
    
    const { firstName, lastName, email, password, passwordConfirmation, role } = data

    // confirmação se email já existe
    const user = await findAdmin({email})
    if (user && email === user.email) {
       return {message: "Email already exists."}
    }

    // confirmação se não há campos vazios
    if (!firstName || !lastName || !email || !password || !passwordConfirmation || !role ) {
        return {message: "There are blank or missing fields"}
    }

    // confirmação se passwords estão iguais
    if (password !== passwordConfirmation) {
        return {message: "Passwords don't match"}
    }

    // Não enviar a confirmação para a DB
    const adminData = { firstName, lastName, email, password, role }

    const id = await insertAdmin(adminData)

    return id
}

// Função login
async function loginAdmin (data) {

    const { email, password } = data
    // erro se email não for encontrado
    const admin = await findAdmin({email})
    if (!admin) {
        return "Email not found!"
    }
    // erro se password não der match
    if (admin.password !== password) {
        return "Invalid password!"
    }
    // atribuir token como o id gerado
    const token = admin._id.toString() 
    // Adicionar token ao Array de Tokens através da função
    addToken(token)
    // Retorno de sucesso com um token
    return { message: "Login successful", token } ;
}

module.exports = { createAdmin, loginAdmin}