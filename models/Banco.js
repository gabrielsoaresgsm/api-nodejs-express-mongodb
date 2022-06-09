const { default: mongoose } = require("mongoose");

const Banco = mongoose.model('Banco', {
    id: Number,
    nome: String,
    agencia: String,
    conta: String,
    password: String,
  })

  module.exports = Banco