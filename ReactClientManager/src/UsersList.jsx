import { useEffect, useState } from "react";
import api from "./services/api";
import { Link } from "react-router-dom";
import "./App.css";
import Trash from "./assets/trash.svg";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editEmail, setEditEmail] = useState("");
 

  async function getUsers() {
    try {
      const usersFromApi = await api.get("/users");
      setUsers(usersFromApi.data);
    } catch (error) {
      alert("Erro ao carregar usuários!", error);
    }
  }

  async function deleteUsers(id) {
    try {
      await api.delete(`/users/${id}`);
      setDeletingUser(null);
      getUsers();
    } catch (error) {
      alert("Erro ao deletar usuário!", error);
    }
  }

  async function editUsers(user) {
    setEditingUser(user);
    setEditName(user.name);
    setEditAge(user.age);
    setEditEmail(user.email);
  }

  async function saveEdit() {
    try {
      await api.put(`/users/${editingUser.id}`, {
        name: editName,
        age: parseInt(editAge),
        email: editEmail,
      });

      setEditingUser(null);
      getUsers();
    } catch (error) {
      alert("Erro ao editar usuário!", error);
    }
  }

  useEffect(() => {
    getUsers();
}, []);

return (

    <div className="container">

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
      <Link to="/">
        <button className="button-link">Voltar</button>
      </Link>
    </div>
  );

}



export default UsersList;
