const express = require('express')
const morgan = require('morgan');
const app = express()


morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]



app.get('/', (request, response) => {
  response.send('<h1>hello!</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.json(404).end()
  }
})

const generateId = () => {
  const newId = Math.floor(Math.random() * 1000000);
  if (persons.some(p => p.id === newId)) {
    return generateId();
  }
  return newId;
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({error: 'name or number missing'})
  }

  const nameExists = persons.some(person => person.name === body.name)
  if (nameExists) {
    return response.status(409).json({error: 'name already exists in the phonebook'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})
// checking if persons length is greater than 0
// if it is, we use math.max to find the highest id
//  we make a shallow copy of persons array and map through persons array to transform it into array of ids
// return the maxId +1

app.delete('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
persons = persons.filter(person => person.id !== id)

response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
