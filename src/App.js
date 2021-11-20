import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import AddPerson from "./components/AddPerson";
import PhoneBookView from "./components/PhoneBookView";
import axios from "axios"
const App = () => {
  const [persons, setPersons] = useState([]);
  const [bookView, setBookView] = useState(persons);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [show, setShow] = useState("");
  const [count, setCount] = useState(5);
  const [toggleEdit, setToggleEdit] = useState("");
  const [newNameEdit, setNewNameEdit] = useState("");
  const [newNumberEdit, setNewNumberEdit] = useState("");

  const loadDb = () => {
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
  })}
  useEffect(loadDb,[]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (persons.find((obj) => obj.name.includes(newName))) {
      return alert(`${newName} is already added to phonebook`);
    }
    setPersons(persons.concat({ id: count, name: newName, number: newNumber }));
    setCount(count + 1);
  };
  const nameFilter = (evt) => {
    setShow(evt.target.value);
  };
  const clickToDelete = (evt) => {
    evt.preventDefault();
    const newArray = persons.filter(
      (obj) => !obj.name.includes(evt.target.name)
    );
    setPersons(newArray);
  };
  const clickToEdit = (evt) => {
    evt.preventDefault();
    setToggleEdit(evt.target.name);
    setNewNumberEdit(evt.target.value);
    setNewNameEdit(evt.target.name);
  };
  const clickToSave = (evt) => {
    evt.preventDefault();
    const index = persons.findIndex((obj) => {
      return obj.name.includes(evt.target.name);
    });
    const newArray = [...persons];
    newArray[index].name = newNameEdit;
    newArray[index].number = newNumberEdit;
    setPersons(newArray);
    setToggleEdit("");
  };
  useEffect(() => {
    const newArray = persons.filter((obj) =>
      obj.name.toLowerCase().includes(show.toLowerCase())
    );
    setBookView(newArray);
  }, [show]);
  useEffect(() => {
    setBookView(persons);
  }, [persons]);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterInput={(evt) => nameFilter(evt)} />
      <hr />
      <h2>add a new</h2>
      <AddPerson
        nameInput={(evt) => setNewName(evt.target.value)}
        numberInput={(evt) => setNewNumber(evt.target.value)}
        onSubmit={(evt) => handleSubmit(evt)}
      />
      <hr />
      <h2>numbers</h2>

      <ul>
        {bookView.map((person) => (
          <PhoneBookView
            key={person.id}
            name={person.name}
            number={person.number}
            toggleEdit={toggleEdit}
            clickToDelete={(evt) => clickToDelete(evt)}
            clickToEdit={(evt) => clickToEdit(evt)}
            clickToSave={(evt) => clickToSave(evt)}
            numberInputEdit={(evt) => setNewNumberEdit(evt.target.value)}
            nameInputEdit={(evt) => setNewNameEdit(evt.target.value)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
