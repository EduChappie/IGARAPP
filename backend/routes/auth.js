const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { db, admin } = require("../config/firebase");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "segredo_temporario";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password, nome, tipo } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email e senha são obrigatórios" });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const userRef = db.collection("users").doc(emailNormalizado);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({ msg: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRef.set({
      email: emailNormalizado,
      nome: nome || "",
      tipo: tipo || "usuario",
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ msg: "Usuário criado com sucesso" });
  } catch (error) {
    console.error("Erro no register:", error);
    res.status(500).json({ msg: "Erro interno no servidor" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email e senha são obrigatórios" });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const userRef = db.collection("users").doc(emailNormalizado);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    const user = userDoc.data();

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(400).json({ msg: "Senha inválida" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        tipo: user.tipo,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      msg: "Login realizado com sucesso",
      token,
      user: {
        email: user.email,
        nome: user.nome,
        tipo: user.tipo,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ msg: "Erro interno no servidor" });
  }
});

module.exports = router;