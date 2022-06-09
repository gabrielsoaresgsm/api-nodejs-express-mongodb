require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require('express').Router()
const User = require("../models/User");


// Rota publica
router.get("/", (req, res) => {
  res.status(200).json({ message: "Login" });
});


// Rota privada
router.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id;
  
    // Verifica se o usuario ja existe
    const user = await User.findById(id, "-password");
  
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
  
    res.status(200).json({ user });
  });
  
  function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ message: "Acesso negado!" });
  
    try {
      const secret = process.env.SECRET;
  
      jwt.verify(token, secret);
  
      next();
    } catch (err) {
      res.status(400).json({ message: "O Token é inválido!" });
    }
  }
  
  router.post("/register", async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
  
    // Valicação
    if (!name) {
      return res.status(422).json({ message: "O nome é obrigatório!" });
    }
  
    if (!email) {
      return res.status(422).json({ message: "O email é obrigatório!" });
    }
  
    if (!password) {
      return res.status(422).json({ message: "A senha é obrigatória!" });
    }
  
    if (password != confirmpassword) {
      return res
        .status(422)
        .json({ message: "A senha e a confirmação precisam ser iguais!" });
    }
  
    // verificar se o usuário existe
    const userExists = await User.findOne({ email: email });
  
    if (userExists) {
      return res.status(422).json({ message: "E-mail já cadastrado, utilize outro e-mail" });
    }
  
    //Criar senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
  
    //Criar usuario
    const user = new User({
      name,
      email,
      password: passwordHash,
    });
  
    try {
      await user.save();
  
      res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: error });
      console.log("Erro 500")
    }
  });
  
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    // Valicação
    if (!email) {
      return res.status(422).json({ message: "O email é obrigatório!" });
    }
  
    if (!password) {
      return res.status(422).json({ message: "A senha é obrigatória!" });
    }
  
    // Verifica se usuario existe
    const user = await User.findOne({ email: email });
  
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
  
    // Verifica se senha existe
    const checkPassword = await bcrypt.compare(password, user.password);
  
    if (!checkPassword) {
      return res.status(422).json({ message: "Senha inválida" });
    }
  
    try {
      const secret = process.env.SECRET;
  
      const token = jwt.sign(
        {
          id: user._id,
        },
        secret
      );
  
      res.status(200).json({ message: "Autenticação realizada com sucesso!", token });
    } catch (error) {
      res.status(500).json({ message: error });
      console.log("Falha na Autenticação")
    }
  });



module.exports = router