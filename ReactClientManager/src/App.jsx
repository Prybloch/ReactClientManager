import { useEffect, useState, useRef} from "react";
import "./App.css";
import Trash from "./assets/trash.svg";
import api from "./services/api";

function App() {
  const [users, setUsers] = useState([]);

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
    getUsers();
  }

  async function deleteUsers(id) {
    await api.delete(`/users/${id}`)
    getUsers();
  }

  async function editUsers(id) {
    await api.put(`/users/${id}`,
      {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      }
    )
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
          <button onClick={() => editUsers(user)}>
            <p>Editar</p>
          </button>
          <button onClick={() => deleteUsers(user.id)}>
            <img src={Trash} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
