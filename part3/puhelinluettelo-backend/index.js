require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

morgan.token('content', (req, res) => JSON.stringify(req.body));

const app = express()
app.use(express.static('build'))
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

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
  .then(person => {
    if (person) {
      res.json(person);
    } else {
      notFound(res);
    }
  })
  .catch((error) => next(error));
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

//   if (!body.name) {
//     return res.status(400).json({
//       error: 'name missing'
//     });
//   }
// 
//   if (!body.number) {
//     return res.status(400).json({
//       error: 'number missing'
//     });
//   }

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
    .then(savedPerson => savedPerson.toJSON())
    .then(savedPerson => res.json(savedPerson))
    .catch(error => {
      next(error)
    });
})

app.get('/info', async (req, res) => {
  const total = await Person.find({}).then(result => result.length);
  const date = new Date();
  const result = `
    <p>Phonebook has info for ${total} people</p>
    <p>${date.toString()}</p>
  `;
  res.send(result);
})

app.get('*', (req, res) => {
  res.status(404).send({error: "Unknown endpoint"});
})

// const unknownEndpoint = (req, res) => {
//   res.status(404).send({error: "Unknown endpoint"});
// }
// 
// app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'});
  } else if (error.name === 'ValidationError') {    
    return res.status(400).json({ error: error.message })  
  }
  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
