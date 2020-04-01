const express = require('express')
const app = express()

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

app.get(`/info`, (req, res) => {
    const infoNow = `Phonebook has info for ${persons.length} people \n\n${new Date}`
    res.end(infoNow)
})

const port = 3001
app.listen(port)
console.log(`server running on port ${port}`)
