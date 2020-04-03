require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('message-body', (req, res) => JSON.stringify(req.body, res.body))
app.use(morgan(':method :url :status :message-body :response-time ms'))

const Person = require('./models/person')

app.use(express.json())

app.get('/', (req, res) => {
    res.json('hello')
})

app.get(`/api/persons`, (req, res, next) => {
    Person.find({}).then(people => {
        res.json(people.map(p => p.toJSON()))
    })
    .catch(error => next(error))
})

app.get(`/api/persons/:id`, (req, res, next) => {
    const id = Number(req.params.id)
    Person.findById(id).then(person => {
        if(person){
            res.json(person.toJSON())
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete(`/api/persons/:id`, (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.put(`/api/persons/:id`, (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.post(`/api/persons`, (req, res, next) => {
    const body = req.body
    if(!body.name){
        return res.status(400).json({error: 'name missing'})
    }
    /*
    if(!body.number){
        return res.status(400).json({
            error: 'number missing'
        })
    } 
    ///this must be changed
        if(persons.map(e => e.name).includes(body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    */

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

///korjattava
app.get(`/info`, (req, res) => {
    const infoNow = `Phonebook has info for ${persons.length} people \n\n${new Date}`
    res.end(infoNow)
})

const unknownEndpoint = (req,res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError' && error.kind == 'ObjectId'){
        return response.status(400).send({ error: 'malformatted id'})
    }
    next(error)
}
app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port)
console.log(`server running on port ${port}`)
