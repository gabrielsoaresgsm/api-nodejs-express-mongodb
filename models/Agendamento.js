const { default: mongoose } = require("mongoose");

const Agendamento = mongoose.model('Agendamento', {
    firstName: String,
    lastName: String,
    servicos: String,
    phone: String,
    email: String,
    dataInicia: String,
    dataFinal: String
  })

  module.exports = Agendamento