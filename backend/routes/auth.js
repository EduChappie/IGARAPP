const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const users = [];

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email e senha são obrigatórios" });
  }

  const exists = users.find((user) => user.email === email);

  if (exists) {
    return res.status(400).json({ msg: "Usuário já existe" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    email,
    password: hashedPassword,
  });

  res.json({ msg: "Usuário criado com sucesso" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email e senha são obrigatórios" });
  }

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ msg: "Usuário não encontrado" });
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    return res.status(400).json({ msg: "Senha inválida" });
  }

  const token = jwt.sign(
    { email: user.email },
    "segredo_temporario",
    { expiresIn: "1h" }
  );

  res.json({
    msg: "Login realizado com sucesso",
    token,
  });
});

module.exports = router;