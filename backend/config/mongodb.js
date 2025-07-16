// importar módulo MongoDB
const { MongoClient } =  require('mongodb')

// Conexão URL
const url = "mongodb://localhost:27017";

// DB name
const defaultNameDb = "hackathon"

// Conexão
let client = undefined;

// Conexão à base de dados
async function getConnection() {
    if (!client) {
        try {
            client = await MongoClient.connect(url)
        } catch (err) {
            
        }
    }
    return client;
}

// Fechar conexão à db
async function closeConnection() {
    const client = await getConnection();
    
    return await client.close()
}

// Aceder à coleção 
async function getCollection(collectionName) {
    const client = await getConnection();
    const db = client.db(defaultNameDb);
    return db.collection(collectionName)
}


// Exportar para outros ficheiros as conexões
module.exports = {getConnection, closeConnection, getCollection}