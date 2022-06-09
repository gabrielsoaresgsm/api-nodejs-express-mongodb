const { default: mongoose } = require("mongoose");

const Outro = mongoose.model('Outro', {

  conta: String,
  password: String,
  descricao: String

  })

  module.exports = Outro