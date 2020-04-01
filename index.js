const express = require('express')
const app = express()


let notes = [
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
    
    res.json(notes)
})

const port = 3001
app.listen(port)
console.log(`server running on port ${port}`)
