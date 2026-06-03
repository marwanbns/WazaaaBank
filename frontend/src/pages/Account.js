import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import axios from "axios";

const Account = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [solde, setSolde] = useState(0);
  const [creationDate, setCreationDate] = useState("");

  // Redirection si non connecté
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);

  // Récupération des infos bancaires depuis bank-service
  useEffect(() => {
    if (isLoggedIn && user?.account_number) {
      axios
        .get(`http://localhost:5001/balance/${user.account_number}`)
        .then(response => {
          setSolde(response.data.solde);
          setCreationDate(response.data.creation_date);
        })
        .catch(() => {
          setSolde(0);
          setCreationDate("Date inconnue");
        });
    }
  }, [user?.account_number, isLoggedIn]);

  // Graphiques
  useEffect(() => {
    const createChart = (id, label, data, color) => {
      const ctx = document.getElementById(id)?.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
              label,
              data,
              backgroundColor: color + "0.2)",
              borderColor: color + "1)",
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
          }
        });
      }
    };

    createChart('appleGraph', 'Apple', [150, 160, 170, 150, 190, 200], 'rgba(255, 99, 132, ');
    createChart('googleGraph', 'Google', [140, 170, 160, 150, 160, 130], 'rgba(255, 206, 86, ');
    createChart('microsoftGraph', 'Microsoft', [160, 150, 140, 130, 120, 150], 'rgba(153, 102, 255, ');
    createChart('facebookGraph', 'Facebook', [110, 140, 130, 130, 150, 140], 'rgba(255, 159, 64, ');
    createChart('teslaGraph', 'Tesla', [140, 160, 150, 140, 130, 150], 'rgba(75, 192, 192, ');
    createChart('amazonGraph', 'Amazon', [190, 190, 130, 150, 160, 190], 'rgba(54, 162, 235, ');
  }, []);

  // Dynamique de l'image de profil (basée sur user.profile_image)
  let profileImage;
  try {
    profileImage = require(`../static/images/userspp/${user.profile_image}`);
  } catch {
    profileImage = require("../static/images/userspp/default.jpg");
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="container text-center">
        <div className="alert alert-warning mt-4 p-3" role="alert">
          ❌ Vous devez être connecté pour voir cette page.
        </div>
      </div>
    );
  }

  return (
    <div className="container text-center">
      <h1>Bienvenue, {user.pseudo} ! 👋</h1>
      <p><strong>Numéro de compte :</strong> {user.account_number}</p>

      <img
        src={profileImage}
        alt="Profil"
        className="profile-picture rounded-circle"
        style={{ width: "150px", height: "150px", objectFit: "cover", border: "4px solid #ddd" }}
      />

      <h3 className="mt-3">💰 Your balance: €{solde}</h3>
      <p><strong>📅 Date de création :</strong> {creationDate}</p>

      <div className="row mt-4">
        <div className="col-md-4"><canvas id="appleGraph"></canvas></div>
        <div className="col-md-4"><canvas id="googleGraph"></canvas></div>
        <div className="col-md-4"><canvas id="microsoftGraph"></canvas></div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4"><canvas id="facebookGraph"></canvas></div>
        <div className="col-md-4"><canvas id="teslaGraph"></canvas></div>
        <div className="col-md-4"><canvas id="amazonGraph"></canvas></div>
      </div>
    </div>
  );
};

export default Account;