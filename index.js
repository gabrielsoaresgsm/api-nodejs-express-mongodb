// config inicial
require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 3000
const { default: mongoose } = require('mongoose')
const app = express()
const cors = require('cors');


// forma de ler JSON / middleweres
app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

app.use((req, res, next) => {
    //console.log("Acessou o Middleware!");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});


// rotas da API
const bancoRoutes = require('./routes/bancoRoutes')
const socialRoutes = require('./routes/socialRoutes')
const userRoutes = require('./routes/userRoutes')
const outroRoutes = require('./routes/outroRoutes')
const agendamentoRoutes = require('./routes/agendamentoRoutes')

app.use('/banco', bancoRoutes)
app.use('/social', socialRoutes)
app.use('/auth', userRoutes)
app.use('/outro', outroRoutes)
app.use('/agendamento', agendamentoRoutes)

// rota inicial / endpoint
app.get('/', (req, res) => {

    // mostrar req

    res.json({ message: 'Bem vindo! API funcionando...' })
})

// entregar porta

const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

mongoose
    .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apisenhas.7ytc7af.mongodb.net/bancodaapi?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log("Conectado ao MongoDB!")
        app.listen(port)
    })
    .catch((err) => console.log(err))


