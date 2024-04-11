import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import PyszneMain from "./components/Pyszne/Pyszne-Main.jsx";

import "../assets/Order.css";
import "../assets/Restauracja.css";
import "../assets/LoginForm-Pyszne.css";
import "react-datepicker/dist/react-datepicker.css";

const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK_PYSZNE;

const decryptToken = () => {
  const encryptedToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_token"))
    ?.split("=")[1];

  if (!encryptedToken) {
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    const token = bytes.toString(CryptoJS.enc.Utf8);

    return token;
  } catch (e) {
    return null;
  }
};

const getUserDataFromCookie = () => {
  const userDataCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_data"))
    ?.split("=")[1];

  if (!userDataCookie) {
    return null;
  }

  try {
    const decodedUserData = decodeURIComponent(userDataCookie);
    return JSON.parse(decodedUserData);
  } catch (e) {
    console.error("Error parsing user data from cookie:", e);
    return null;
  }
};

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
};

const Pyszne = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null); // ID обраного ресторану
  const [profileExists, setProfileExists] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const token = decryptToken();

    const config = {
      headers: {
        "Content-Type": "application/vnd.api+json",
        "Accept-Language": "nl-NL,nl;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Accept: "application/json, text/plain, */*",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${apiUrl}api/tokenspyszneorders`,
        {
          username: username,
          password: password,
        },
        config
      );

      console.log("Response data from the server:", response.data);

      // Check if the response starts with 'Successfully Orders:'
      if (response.data?.OrdersPyszne?.startsWith("Successfully Orders:")) {
        // Send data to /store-pysznedane
        try {
          const userData = getUserDataFromCookie();
          const restaurantId = userData ? userData.id : null;

          if (!restaurantId) {
            setError("Nie znaleziono identyfikatora restauracji.");
            return;
          }
          setLoading(true);
          const storeResponse = await axios.post(
            `${apiUrl}api/store-pysznedane`,
            {
              username: username,
              password: password,
              restaurant_id: restaurantId, // Use extracted restaurant_id
            },
            config
          );

          console.log("Odpowiedź sklepu:", storeResponse.data);
          window.location.reload();
        } catch (storeError) {
          console.error("Błąd w zapisywaniu danych:", storeError.response);
          setError(
            storeError.response
              ? storeError.response.data.message
              : storeError.message
          );
        }
      } else if (response.data?.OrdersPyszne?.startsWith("ERROR:")) {
        // Handle error scenario
        setError("Błąd logowania");
      }
    } catch (err) {
      console.error("Error response from the server:", err.response);

      // Check if the error is about the username being taken
      if (
        err.response?.data?.username?.[0] ===
        "The username has already been taken."
      ) {
        setError("Taki użytkownik już dodał swój profil.");
      } else {
        setError(err.response ? err.response.data.message : err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkProfileExistence = async () => {
      setLoading(true);
      try {
        const userData = getUserDataFromCookie();
        const restaurantId = userData ? userData.id : null;
        if (restaurantId) {
          const token = decryptToken();
          // First, check if the profile exists
          const profileResponse = await axios.get(
            `${apiUrl}api/pysznedaneget`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                restaurant_id: restaurantId,
              },
            }
          );

          if (profileResponse.data.length > 0) {
            // Profile exists, now verify with tokenspyszneorders
            const orderResponse = await axios.post(
              `${apiUrl}api/tokenspyszneorders`,
              {
                username: profileResponse.data[0].username,
                password: profileResponse.data[0].password,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (
              orderResponse.data?.OrdersPyszne?.startsWith(
                "Successfully Orders:"
              )
            ) {
              setProfileExists(true); // Set profile as existing only if orders are successfully fetched
            }
          }
        }
      } catch (error) {
        console.error("Error checking profile existence:", error);
      } finally {
        setLoading(false); // Виключити індикатор завантаження
      }
    };

    checkProfileExistence();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="order white-rounded-box">
        <div className="row">
          <div className="left-group">
            <div className="group-text">Zaloguj się do Pysznego</div>
          </div>
          <div className="right-groups"></div>
        </div>

        <div className="centering-container-1">
          <div className="box-1">
            {profileExists ? (
              <PyszneMain />
            ) : (
              <form onSubmit={handleLogin}>
                {/* Email input */}
                <div className="overlap-group" style={{ marginBottom: "10px" }}>
                  <input
                    className="gmail-com"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=" "
                    required
                  />
                  <FontAwesomeIcon
                    className="icon-envelope"
                    icon={faUser}
                    style={{ paddingRight: "9px" }}
                  />
                  <div className="text-wrapper">Username</div>
                  <div className="line"></div>
                </div>

                {/* Password input */}
                <div className="overlap-group">
                  <input
                    type="password"
                    className="gmail-com"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    required
                  />
                  <FontAwesomeIcon
                    className="icon-envelope"
                    icon={faLock}
                    style={{ paddingRight: "9px" }}
                  />
                  <div className="text-wrapper">Hasło</div>
                  <div className="line"></div>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  className="login-button-1"
                  disabled={loading}
                >
                  {loading ? "Ładowanie..." : "Zaloguj sie"}
                </button>

                {/* Error message */}
                {error && <div className="error-message">{error}</div>}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pyszne;
