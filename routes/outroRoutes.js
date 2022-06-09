const router = require('express').Router()

const Outro = require('../models/Outro')


// Criação de dados
router.post('/', async (req, res) => {

    // req.body
    const { conta, password, descricao} = req.body

    if(!conta) {
        res.status(422).json({message: 'Campo id é obrigatorio'}) // Erro, caso os dados nao foram criados com sucesso
        return
    } else if (!password){
        res.status(422).json({message: 'Campo nome é obrigatorio'})
        return
    } else if (!descricao){
        res.status(422).json({message: 'Campo agencia é obrigatorio'})
        return
    }

    const outro = {
        conta,
        password,
        descricao
    }

    // Criar dados em outros

    try{

        await Outro.create(outro)

        res.status(201).json({message: 'Conta inserida com sucesso'}) // Dados criado com sucesso

        
    } catch (error) {
        res.status(500).json({error: error})
    }
})

// Read - Leitura de dados

router.get('/', async (req, res) =>{
    try {

        const outros = await Outro.find()

        res.status(200).json(outros)

    } catch (error) {
        res.status(500).json({error: error})
        
    }
})


router.get('/:id', async (req, res) =>{
    

    // Extrair dados da requisição, pela url = req.params
    const id = req.params.id

    try {

        const outro = await Outro.findOne({id: id})

        if(!outro){
            res.status(422).json({message: `A conta com id ${id} não foi encontrado`})
            return
        }

        res.status(200).json(outro)
        
    } catch (error) {
        res.status(500).json({error: error})
    }

})




// UPDATE - Atualização de dados ( PUT, PATCH )
router.patch('/:id', async (req, res) => {

    const id = req.params.id

    const { conta, password, descricao} = req.body

    const outro = {
        conta,
        password,
        descricao
    }

    try {
        const updateOutro = await Outro.updateOne({id: id}, outro)

        if (updateOutro.matchedCount === 0) {
            res.status(422).json({message: `A conta com id ${id} não foi encontrado`})
            return
        }

        res.status(200).json(outro)
    } catch (error) {
        res.status(500).json({error: error})        
    }
})

// DELET - Deletar dados
router.delete('/:id', async (req, res) => {

    const id = req.params.id
    
    const outro = await Outro.findOne({_id: id})

    if(!outro){
        res.status(422).json({message: `A conta com id ${id} não foi encontrado`})
        return
    }

    try {
        await Outro.deleteOne({_id: id})
        res.status(200).json({message: `Conta: ${outro.conta}, removido com sucesso!`})
    } catch (error) {
        res.status(500).json({error: error})
    }

})


module.exports = router