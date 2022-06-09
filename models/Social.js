const { default: mongoose } = require("mongoose");


// Definindo entrada de dados nas variaveis

const Social = mongoose.model('Social', {
    id: Number,
    nome: String,
    email: String,
    password: String

  })

  module.exports = Social