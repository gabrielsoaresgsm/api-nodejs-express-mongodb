const router = require('express').Router()

const Banco = require('../models/Banco')


// Criação de dados
router.post('/', async (req, res) => {

    // req.body

    // {id: "", banco: "", agencia: "", conta: "", password: ""}
    const {id, nome, agencia, conta, password} = req.body

    if(!id) {
        res.status(422).json({message: 'Campo id é obrigatorio'}) // Erro, caso os dados nao foram criados com sucesso
        return
    } else if (!nome){
        res.status(422).json({message: 'Campo nome é obrigatorio'})
        return
    } else if (!agencia){
        res.status(422).json({message: 'Campo agencia é obrigatorio'})
        return
    } else if (!conta){
        res.status(422).json({message: 'Campo conta é obrigatorio'})
        return
    } else if (!password){
        res.status(422).json({message: 'Campo password é obrigatorio'})
        return
    }

    const userExists = await Banco.findOne({ id: id });
  
    if (userExists) {
      return res.status(422).json({ message: "ID já cadastrado, utilize outro" });
    }

    const banco = {
        id,
        nome,
        agencia,
        conta,
        password
    }

    // Criar dados no banco

    try{

        await Banco.create(banco)

        res.status(201).json({message: 'Banco inserido com sucesso'}) // Dados criado com sucesso

        
    } catch (error) {
        res.status(500).json({error: error})
    }
})

// Read - Leitura de dados

router.get('/', async (req, res) =>{
    try {

        const bancos = await Banco.find()

        res.status(200).json(bancos)

    } catch (error) {
        res.status(500).json({error: error})
        
    }
})


router.get('/:id', async (req, res) =>{
    

    // Extrair dados da requisição, pela url = req.params
    const id = req.params.id

    try {

        const banco = await Banco.findOne({id: id})

        if(!banco){
            res.status(422).json({message: `O banco com id ${id} não foi encontrado`})
            return
        }

        res.status(200).json(banco)
        
    } catch (error) {
        res.status(500).json({error: error})
    }

})




// UPDATE - Atualização de dados ( PUT, PATCH )
router.patch('/:id', async (req, res) => {

    const id = req.params.id

    const {nome, agencia, conta, password} = req.body

    const banco = {
        nome,
        agencia,
        conta,
        password
    }

    try {
        const updateBanco = await Banco.updateOne({id: id}, banco)

        if (updateBanco.matchedCount === 0) {
            res.status(422).json({message: `O banco com id ${id} não foi encontrado`})
            return
        }

        res.status(200).json(banco)
    } catch (error) {
        res.status(500).json({error: error})        
    }
})

// DELET - Deletar dados
router.delete('/:id', async (req, res) => {

    const id = req.params.id
    
    const banco = await Banco.findOne({_id: id})

    // if (id === ""){
    //     return res.status(400).json({error: 'Usuário nao informado'})
    // }
    if(!banco){
        res.status(422).json({message: `O banco com id ${id} não foi encontrado`})
        return
    }

    try {
        await Banco.deleteOne({id: id})
        res.status(200).json({message: `Banco: ${banco.nome}, removido com sucesso!`})
    } catch (error) {
        res.status(500).json({error: error})
    }

})


module.exports = router



/*
Iniciar servidor: npm start

Avisos:
Respostas de informação (100-199)
Respostas de sucesso (200-299)
Redirecionamentos (300-399)
Erros do cliente (400-499)
Erros do servidor (500-599)

*/