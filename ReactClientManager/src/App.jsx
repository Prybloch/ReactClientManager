import { useEffect, useState, useRef} from "react";
import "./App.css";
import Trash from "./assets/trash.svg";
import api from "./services/api";

function App() {
  const [users, setUsers] = useState([]);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  async function getUsers() {
    const usersFromApi = await api.get("/users");

    setUsers(usersFromApi.data);
  }

  async function createUsers() {
    await api.post('/users',
      {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      }
    )
    
    inputName.current.value = '';
    inputAge.current.value = '';
    inputEmail.current.value = '';

    getUsers();
  }

  async function deleteUsers(id) {
    await api.delete(`/users/${id}`)
    setDeletingUser(null)
    getUsers();
  }

  async function editUsers(user) {
    setEditingUser(user);
    setEditName(user.name);
    setEditAge(user.age);
    setEditEmail(user.email);
  }

  async function saveEdit() {
    await api.put(`/users/${editingUser.id}`, {
      name: editName,
      age: parseInt(editAge),
      email: editEmail
    })

    setEditingUser(null);
    getUsers();
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Clientes</h1>
        <input placeholder="Nome" name="name" type="text" ref={inputName} />
        <input placeholder="Idade" name="age" type="number" ref={inputAge}/>
        <input placeholder="E-mail" name="email" type="email" ref={inputEmail} />
        <button type="button" onClick={createUsers}>Cadastrar</button>
      </form>

      {editingUser && (
        <div className="overlay">
        <div className="edit-section">
          <h2>Editando: {editingUser.name}</h2>
          <input placeholder="Nome" type="text" value={editName} onChange = {(e) => setEditName(e.target.value)}/>
          <input placeholder="Idade" type="number" value={editAge} onChange = {(e) => setEditAge(e.target.value)} />
          <input placeholder="E-mail" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}/>
          <button onClick={saveEdit}>Salvar</button>
          <button onClick={() => setEditingUser(null)}>Cancelar</button>
        </div>
        </div>
      )}

      {deletingUser && (
        <div className="overlay">
          <div className="delete-section">
          <p>Você tem certeza que deseja excluir {deletingUser.name}?</p>
          <button onClick={() => deleteUsers(deletingUser.id)}>Sim</button>
          <button onClick={() => setDeletingUser(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>
              Nome: <span>{user.name}</span>
            </p>
            <p>
              Idade: <span>{user.age}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
          </div>
          <button className="edit-button" onClick={() => editUsers(user)}>
            Editar
          </button>
          <button onClick={() => setDeletingUser(user)}>
            <img src={Trash} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
