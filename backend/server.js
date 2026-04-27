const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ msg: "API rodando" });
});

const PORT = 3001;

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    msg: "Rota protegida acessada",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});