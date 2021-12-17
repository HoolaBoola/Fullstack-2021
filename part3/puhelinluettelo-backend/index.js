require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

morgan.token('content', (req, res) => JSON.stringify(req.body));

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [  
  { 
    id: 1, 
    name: "Arto Hellas",
    number: "040-123456"
  },
  { 
    id: 2, 
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  { 
    id: 3,  
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

const generateID = () => {
  let id = Math.floor(Math.random() * 100000);
  while (persons.find(p => p.id === id)) {
    id = Math.floor(Math.random() * 100000);
  }

  return id;
}

const notFound = (res) => {
  res.send("<h1>404 - Not found</h1>", 404);
}

app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result);
  });
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id)
  .then(person => {
    res.json(person);
  })
  .catch((error) => {
    notFound(res)
  });
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  console.log(persons);
  res.status(204).end();
})

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    });
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(422).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });
  person.save()
  .then(savedPerson => {
    res.json(savedPerson);
  });
})

app.get('/info', (req, res) => {
  const total = persons.length;
  const date = new Date();
  const result = `
    <p>Phonebook has info for ${total} people</p>
    <p>${date.toString()}</p>
  `;
  res.send(result);
})

app.get('*', (req, res) => {
  notFound(res);
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
