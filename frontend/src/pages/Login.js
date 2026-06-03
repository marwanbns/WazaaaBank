import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate(); // On utilise un Hook de navigation

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login({
          token: data.token,
          pseudo: data.pseudo,
          account_number: data.account_number,
          profile_image: data.profile_image
        });
         // Connexion réussie
        navigate("/"); // Redirection vers Home
        localStorage.setItem("loginMessage", `✅ Bienvenue ${pseudo} !`);
      } else {
        setMessage("❌ Identifiants incorrects.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setMessage("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center">Connexion</h2>
        {message && <div className="alert alert-danger text-center">{message}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Pseudo</label>
            <input
              type="text"
              className="form-control"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de Passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">Login</button>
        </form>
        <p className="text-center mt-3">
          Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
        </p>
      </div>
    </div>
  );
};

export default Login;