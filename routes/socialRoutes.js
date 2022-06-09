const router = require('express').Router()

const Social = require ('../models/Social')


router.post('/', async (req, res) => {

    // req.body
    const {id, nome, email, password} = req.body

    if(!id) {
        res.status(422).json({message: 'Campo id é obrigatorio'}) // Erro, caso os dados nao foram criados com sucesso
        return
    } else if (!nome){
        res.status(422).json({message: 'Campo nome é obrigatorio'})
        return
    } else if (!email){
        res.status(422).json({message: 'Campo email é obrigatorio'})
        return
    } else if (!password){
        res.status(422).json({message: 'Campo password é obrigatorio'})
        return
    } 

    const social ={
        id,
        nome,
        email,
        password
    }

    try {
        await Social.create(social)
        res.status(201).json({message: 'Rede Social inserida com sucesso'})
    } catch (error) {
        res.status(500).json({error: error})
    }
});

router.get('/', async (req, res) =>{
    try {

        const redesSocial = await Social.find()

        res.status(200).json(redesSocial)

    } catch (error) {
        res.status(500).json({error: error})
        
    }
})

router.get('/:id', async (req, res) =>{
    

    // Extrair dados da requisição, pela url = req.params
    const id = req.params.id

    try {

        const social = await Social.findOne({id: id})

        if(!social){
            res.status(422).json({message: `O banco com id ${id} não foi encontrado`})
            return
        }

        res.status(200).json(social)
        
    } catch (error) {
        res.status(500).json({error: error})
        console.log("Erro 500")
    }

})


// UPDATE - Atualização de dados ( PUT, PATCH )
router.patch('/:id', async (req, res) => {

    const id = req.params.id

    const {nome, email, password} = req.body

    const social = {
        nome,
        email,
        password
    }

    try {
        const updateSocial = await Social.updateOne({id: id}, social)
        // Se matchedCount === 1 a rede social possui cadastro
        if (updateSocial.matchedCount === 0) {
            res.status(422).json({message: `A Rede Social com id ${id} não foi encontrado`})
            return
        }

        res.status(200).json({message: 'Rede Social atualizada com sucesso', social})
    } catch (error) {
        res.status(500).json({error: error})        
    }
})

// DELET - Deletar dados
router.delete('/:id', async (req, res) => {

    const id = req.params.id
    
    const social = await Social.findOne({id: id})

    if(!social){
        res.status(422).json({message: `A Rede Social com id ${id} não foi encontrado`})
        return
    }

    try {
        await Social.deleteOne({id: id})
        res.status(200).json({message: `Rede Social: ${social.nome}, removido com sucesso!`})
    } catch (error) {
        res.status(500).json({error: error})
    }

})




module.exports = router
