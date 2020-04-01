const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.json('hello')
})

const port = 3001
app.listen(port)
console.log(`server running on port ${port}`)
