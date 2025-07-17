// routes/auth.route.js
const express = require("express");
const router = express.Router();

const { createAdmin, loginAdmin } = require("../services/admin");
const { addToken, tokensArr } = require("../services/authToken");


// POST Create admin
router.post("/register", async (req, res) => {
  try {
    const data = req.body
    const result = await createAdmin(data);

    // Retorno de erros
    if (result.message) {
      return res.status(400).json({ message: result.message });
    }
    // Sucesso na criação do Admin
    res.status(200).json({ message: "Admin created successfully", adminId: result });
  } catch (err) {
    res.status(500).json({ message: "Internal error" });
  }
});


// POST Login do admin
router.post("/login", async (req, res) => {
  try {
    // criação de variável com o que se recebe do form
    const data = req.body
    // importar função de findUser com o que receberes do data
    const result = await loginAdmin(data);
    // se der erro, retornar erro
    if (result === "Email not found!") {
        return res.status(400).json({ error: result });
    }
    if (result === "Invalid password!") {
        return res.status(400).json({ error: result });
    }

    return res.status(200).json({ message: "Logged in", token: result });
    } catch (err) {
    return res.status(500).json({ message: "Internal server error"})
    }
});


module.exports = router;