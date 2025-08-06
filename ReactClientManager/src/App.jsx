import { useEffect, useState, useRef} from "react";
import "./App.css";
import api from "./services/api";
import { Link } from "react-router-dom";



function App() {
  const [users, setUsers] = useState([]);
   const [emailError, setEmailError] = useState("");
   const [showSuccessCreation, setShowSuccessCreation] = useState(false);

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  async function getUsers() {
    try {
      const usersFromApi = await api.get("/users");

      setUsers(usersFromApi.data);
    } catch (error) {
      alert("Erro ao carregar usuários!", error);
    }
  }

  async function createUsers() {
    try {
      const emailExists = users.find(
        (user) => user.email === inputEmail.current.value
      );

      if (emailExists) {
        setEmailError("Este email já está cadastrado.");
        return;
      }

      setEmailError("");

      await api.post("/users", {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value,
      });

      inputName.current.value = "";
      inputAge.current.value = "";
      inputEmail.current.value = "";


      getUsers();
      setShowSuccessCreation(true);
      setTimeout(() => {
        setShowSuccessCreation(false);
      }, 3000);

    } catch (error) {
      alert("Erro ao cadastrar usuário!", error);
    }
  }


  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Clientes</h1>
        <input placeholder="Nome" name="name" type="text" ref={inputName} />
        <input placeholder="Idade" name="age" type="number" ref={inputAge} />
        <input
          placeholder="E-mail"
          name="email"
          type="email"
          ref={inputEmail}
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>

      {showSuccessCreation && (
        <div className="toast-success">Usuário cadastrado com sucesso!</div>
      )}

     <Link to= "/clients">
      <button className="button-link">Ver usuários cadastrados</button>
      </Link>
      </div>
  );
     
}

export default App;
