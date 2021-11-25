import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons] = useState([]);

  useEffect(() => {
    personService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons);
      });
  }, []);


  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');

  const filtered = () => {
    return persons.filter(person => 
      person.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();
    const foundPerson = persons.find(person => person.name === newName);
    if (foundPerson) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the old phone number with a new one?`)) {
        updatePerson(foundPerson, newNumber);
      } 
      return;
    }

    const personObject = {name: newName, number: newNumber};
    personService
      .create(personObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson));
        setNewName('');
        setNewNumber('');
      });
  }

  const deletePerson = person => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return;
    }

    personService
      .remove(person.id)
      .then(data => {
        const copyPersons = persons.filter(p => p.id !== person.id);
        setPersons(copyPersons);
      })
  }

    const updatePerson = (newPerson, number) => {
      newPerson.number = number;
      personService
        .update(newPerson.id, newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== newPerson.id ? person : returnedPerson));
          setNewName('');
          setNewNumber('');
        })
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} handleFilterChange={handleFilterChange} />

      <h2>Add new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      
      <Persons persons={filtered()} deletePerson={deletePerson} />
    </div>
  )

}

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map(person => 
        <p key={person.name}> 
          {person.name} {person.number}
          <button onClick={() => deletePerson(person)}>
            delete
          </button>
        </p>
      )}
    </div>
  );
}

const Filter = ({filter, handleFilterChange}) => {
  return (
    <div>
      filter: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>

      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
export default App
