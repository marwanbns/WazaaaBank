import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { user, isLoggedIn } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmCreate, setShowConfirmCreate] = useState(false);
  const [newUser, setNewUser] = useState({ pseudo: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  // Redirection si pas admin
  useEffect(() => {
    if (!isLoggedIn || user.pseudo !== "admin") {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);

  useEffect(() => {
    const fetchBalances = async () => {
      const updatedUsers = await Promise.all(
        users.map(async (u) => {
          try {
            const res = await axios.get(`http://127.0.0.1:5001/balance/${u.account_number}`);
            return { ...u, solde: res.data.solde };
          } catch (error) {
            return { ...u, solde: 0 };
          }
        })
      );
      setUsers(updatedUsers);
    };
  
    if (users.length > 0) {
      fetchBalances();
    }
  }, [users.length]);  

  // Récupération des utilisateurs
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs :", error);
      });
  }, []);

  // Afficher/Cacher la modal
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser("");
  };

  // Afficher/Cacher la confirmation
  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);
  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewUser({ pseudo: "", password: "", confirmPassword: "" });
  };
  const openConfirmCreate = () => setShowConfirmCreate(true);
  const closeConfirmCreate = () => setShowConfirmCreate(false);

  // Suppression d'un utilisateur
  const handleDelete = () => {
    if (!selectedUser) {
      setFlashMessage({ type: "warning", text: "⚠️ Please select a user to delete." });
      return;
    }

    if (selectedUser.toLowerCase() === "admin") {
      setFlashMessage({ type: "danger", text: "❌ You cannot delete the admin account." });
      return;
    }

    // Ouvrir la confirmation
    openConfirm();
  };

  const confirmDelete = async () => {
    try {
      // Récupérer les infos de l'utilisateur (pour son account_number)
      const userToDelete = users.find(u => u.pseudo === selectedUser);
      if (!userToDelete) {
        setFlashMessage({ type: "danger", text: "❌ Utilisateur introuvable." });
        return;
      }
  
      const accountNumber = userToDelete.account_number;
  
      // 1. Supprimer du auth-service
      await axios.post("http://127.0.0.1:5000/delete", { pseudo: selectedUser });
  
      // 2. Supprimer du bank-service
      await axios.post("http://127.0.0.1:5001/delete", { account_number: accountNumber });
  
      setFlashMessage({
        type: "success",
        text: `✅ Le compte '${selectedUser}' a été supprimé dans les deux services.`,
      });
  
      // Mettre à jour l'affichage
      setUsers((prevUsers) => prevUsers.filter((u) => u.pseudo !== selectedUser));
      closeModal();
      closeConfirm();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setFlashMessage({ type: "danger", text: "❌ La suppression a échoué." });
    }
  };
  

  // Création d’un utilisateur
const handleCreate = () => {
  if (!newUser.pseudo || !newUser.password || !newUser.confirmPassword) {
    setFlashMessage({ type: "warning", text: "⚠️ All fields are required." });
    return;
  }

  if (newUser.password !== newUser.confirmPassword) {
    setFlashMessage({ type: "danger", text: "❌ Passwords do not match." });
    return;
  }

  openConfirmCreate();
};

const confirmCreate = async () => {
  try {
    // Étape 1 : création dans auth-service
    const authRes = await axios.post("http://127.0.0.1:5000/register", {
      pseudo: newUser.pseudo,
      password: newUser.password
    });

    const account_number = authRes.data.account_number;

    // Générer solde aléatoire et date actuelle
    const randomSolde = Math.floor(Math.random() * 700000);
    const creationDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Étape 2 : création dans bank-service AVEC les champs nécessaires
    await axios.post("http://127.0.0.1:5001/register", {
      account_number: account_number,
      solde: randomSolde,
      creation_date: creationDate
    });

    // Succès
    setFlashMessage({ type: "success", text: `✅ Account '${newUser.pseudo}' created successfully.` });

    // Ajout à la liste
    setUsers(prev => [
      ...prev,
      { pseudo: newUser.pseudo, profile_image: "default.jpg", account_number }
    ]);

    // Reset
    closeCreateModal();
    closeConfirmCreate();
    setNewUser({ pseudo: "", password: "", confirmPassword: "" });

  } catch (error) {
    console.error("Erreur lors de la création :", error);
    setFlashMessage({ type: "danger", text: "❌ Failed to create the user." });
  }
};


  return (
    <div className="container text-center">
      <h1 className="mt-4">Admin Page</h1>
      <div className="alert alert-success mt-3">Welcome, <strong>{user?.pseudo}</strong>!</div>

      {/*Messages Flash */}
      {flashMessage && (
        <div className={`alert alert-${flashMessage.type} alert-dismissible fade show`} role="alert">
          {flashMessage.text}
          <button type="button" className="btn-close" onClick={() => setFlashMessage(null)}></button>
        </div>
      )}

      <div className="admin-buttons mb-4">
        <button className="btn btn-primary me-2" onClick={openCreateModal}>➕ Create an account</button>
        <button className="btn btn-danger" onClick={openModal}>🗑️ Delete an account</button>
      </div>

      <h2 className="mb-4">All Users</h2>
      <div className="row justify-content-center">
        {users.map((user) => {
          let profileImage;
          try {
            profileImage = require(`../static/images/userspp/${user.profile_image}`);
          } catch (error) {
            profileImage = require("../static/images/userspp/default.jpg");
          }

          return (
            <div key={user.pseudo} className="col-md-3 mb-4">
              <div className="user-card shadow-sm p-3 rounded text-center">
                <img src={profileImage} alt="Profile" className="profile-picture rounded-circle img-fluid" />
                <h5 className="mt-2"><strong>{user.pseudo}</strong></h5>
                <p className="balance">💰 Balance: <strong>€{user.solde ?? 0}</strong></p>
              </div>
            </div>
          );
        })}
      </div>

      {/*Modal de création */}
      {showCreateModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <h5>Create an account</h5>
            <button className="custom-close" onClick={closeCreateModal}>✖</button>
            <input type="text" placeholder="Pseudo" className="form-control mb-2" onChange={(e) => setNewUser({ ...newUser, pseudo: e.target.value })} />
            <input type="password" placeholder="Password" className="form-control mb-2" onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <input type="password" placeholder="Confirm Password" className="form-control mb-2" onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })} />
            <div className="custom-footer">
              <button className="btn btn-secondary" onClick={closeCreateModal}>Cancel</button>
              <button className="btn btn-success" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/*Modal de confirmation de création */}
      {showConfirmCreate && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <h5>Confirm account creation</h5>
            <p>Are you sure you want to create the account <strong>{newUser.pseudo}</strong>?</p>
            <div className="custom-footer">
              <button className="btn btn-secondary" onClick={closeConfirmCreate}>Cancel</button>
              <button className="btn btn-success" onClick={confirmCreate}>Yes, Create</button>
            </div>
          </div>
        </div>
      )}

      {/*Modal de suppression */}
      {showModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <h5>Delete account</h5>
            <button className="custom-close" onClick={closeModal}>✖</button>
            <label htmlFor="deleteUsername" className="form-label">Select an account to delete:</label>
            <select
              className="form-select mb-3"
              id="deleteUsername"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select a user</option>
              {users.filter((user) => user.pseudo.toLowerCase() !== "admin").map((user) => (
                <option key={user.pseudo} value={user.pseudo}>{user.pseudo}</option>
              ))}
            </select>
            <div className="custom-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/*Modal de confirmation */}
      {showConfirm && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <h5>Are you sure?</h5>
            <p>Do you really want to delete <strong>{selectedUser}</strong>? This action cannot be undone.</p>
            <div className="custom-footer">
              <button className="btn btn-secondary" onClick={closeConfirm}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/*Ajout du style CSS */}
      <style>
        {`
          .custom-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .custom-modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            min-width: 350px;
            position: relative;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          }
          .custom-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #888;
          }
          .custom-close:hover {
            color: red;
          }
          .custom-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default Admin;