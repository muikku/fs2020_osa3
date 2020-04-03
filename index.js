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

let persons = [
    {
      id: 1,
      name: "HTML is easy",
      number: "2020-01-10T17:30:31.098Z"
    },
    {
      id: 2,
      name: "Browser can execute only Javascript",
      number: "2020-01-10T18:39:34.091Z"
    },
    {
      id: 3,
      name: "GET and POST are the most important methods of HTTP protocol",
      number: "2020-01-10T19:20:14.298Z"
    }
  ]

app.use(express.json())

app.get('/', (req, res) => {
    res.json('hello')
})

app.get(`/api/persons`, (req, res) => {
    res.json(persons)
})

app.get(`/api/persons/:id`, (req, res) => {
    const id = Number(req.params.id)
    const contact = persons.find(p => p.id === id)
    if(contact){
        res.json(contact)
    } else {
        res.status(404).end()
    }
})

app.delete(`/api/persons/:id`, (req, res) => {
    const id = Number(req.params.id)
    if(persons.map(p => p.id).includes(id)){
        persons = persons.filter(p => p.id !== id)
        res.status(204).end()
    } 
    res.status(404).end()
})

app.post(`/api/persons`, (req, res) => {
    const body = req.body
    if(!body.name){
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number){
        return res.status(400).json({
            error: 'number missing'
        })
    } 
    if(persons.map(e => e.name).includes(body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })

    
})

app.get(`/info`, (req, res) => {
    const infoNow = `Phonebook has info for ${persons.length} people \n\n${new Date}`
    res.end(infoNow)
})

const port = process.env.PORT || 3001
app.listen(port)
console.log(`server running on port ${port}`)
