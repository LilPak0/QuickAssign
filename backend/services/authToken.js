const {  } = require('../data/user');
const { ObjectId } = require('mongodb');

// Criação de array de tokens de sessão
const tokensArr = [];

async function authenticateToken (token) {
    // Verificar se token foi recebido
      if (!token) {
        throw new Error("Token not sent");
    }
    // Verificar se existe sessão com o token recebido
    if (!tokensArr.includes(token)) {
        throw new Error("There isn't a session with the Token!");
    }
    // Verificar se token é válido
    if (!ObjectId.isValid(token)) {
        throw new Error("Invalid Token!");
    }
    const id = new ObjectId(String(token))
    // Procurar o utilizador com base no token (que é o _id)
    const user = await findUser({ _id: id });
    // Se não encontrar utilizador com o respetivo Token
    if (!user) {
        throw new Error("User not found.");
    }

    return user
}

// Adicionar tokens ao array de sessão
function addToken(token) {
    tokensArr.push(token);
    
}

module.exports = { tokensArr, addToken, authenticateToken }
