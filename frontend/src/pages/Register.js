import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Étape 1 : Création de l'utilisateur via auth-service
      const response = await axios.post("http://127.0.0.1:5000/register", {
        pseudo,
        password
      });

      if (response.status === 201) {
        const accountNumber = response.data.account_number;

        // Étape 2 : Création du compte bancaire via bank-service
        const randomSolde = Math.floor(Math.random() * 700000);
        const creationDate = new Date().toISOString().slice(0, 19).replace("T", " ");

        await axios.post("http://127.0.0.1:5001/register", {
          account_number: accountNumber,
          solde: randomSolde,
          creation_date: creationDate
        });

        setMessage(`✅ Compte créé avec succès ! Numéro de compte : ${accountNumber}`);
        setPseudo("");
        setPassword("");
        setConfirmPassword("");

        // Redirection après délai
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setMessage(`❌ ${error.response.data.error}`);
      } else {
        setMessage("❌ Une erreur est survenue, réessayez plus tard.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center">Inscription</h2>
        {message && <div className="alert alert-info text-center">{message}</div>}
        <form onSubmit={handleRegister}>
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
          <div className="mb-3">
            <label className="form-label">Confirmer Mot de Passe</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">S'inscrire</button>
        </form>
        <p className="text-center mt-3">
          Déjà un compte ? <a href="/login">Connectez-vous</a>
        </p>
      </div>
    </div>
  );
};

export default Register;