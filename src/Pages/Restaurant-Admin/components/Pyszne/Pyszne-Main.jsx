import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
// ... other imports


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

function PyszneMain() {

    const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const deleteUserProfile = async () => {
    setLoading(true);
    try {
      const userData = getUserDataFromCookie();
      const restaurantId = userData ? userData.id : null;
      if (restaurantId) {
        const token = decryptToken();
        // Check if the profile exists
        const profileResponse = await axios.get(`${apiUrl}api/pysznedaneget`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { restaurant_id: restaurantId },
        });

        if (profileResponse.data.length > 0) {
          setProfileExists(true);

          // Delete user data
          const deleteResponse = await axios.post(`${apiUrl}api/delete-user-pysznedane`, {
            username: profileResponse.data[0].username,
          }, { headers: { Authorization: `Bearer ${token}` } });

          if (deleteResponse.status === 200) {
            // Handle post-delete logic here (e.g., redirect or show message)
            // Reload the page after successful deletion
            window.location.reload();
          }
          // Handle post-delete logic here (e.g., redirect or show message)
        }
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="checkmark">
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 161.2 161.2"
        enableBackground="new 0 0 161.2 161.2"
        xmlSpace="preserve"
      >
        <path
          className="path"
          fill="none"
          stroke="#7DB0D5"
          strokeMiterlimit="10"
          d="M425.9,52.1L425.9,52.1c-2.2-2.6-6-2.6-8.3-0.1l-42.7,46.2l-14.3-16.4 c-2.3-2.7-6.2-2.7-8.6-0.1c-1.9,2.1-2.0,5.6-0.1,7.7l17.6,20.3c0.2,0.3,0.4,0.6,0.6,0.9c1.8,2,4.4,2.5,6.6,1.4c0.7-0.3,1.4-0.8,2-1.5 c0.3-0.3,0.5-0.6,0.7-0.9l46.3-50.1C427.7,57.5,427.7,54.2,425.9,52.1z"
        />
        <circle
          className="path"
          fill="none"
          stroke="#ff8000"
          strokeWidth="4"
          strokeMiterlimit="10"
          cx="80.6"
          cy="80.6"
          r="62.1"
        />
        <polyline
          className="path"
          fill="none"
          stroke="#ff8000"
          strokeWidth="6"
          strokeLinecap="round"
          strokeMiterlimit="10"
          points="113,52.8 74.1,108.4 48.2,86.4 "
        />

        <circle
          className="spin"
          fill="none"
          stroke="#ff8000"
          strokeWidth="4"
          strokeMiterlimit="10"
          strokeDasharray="12.2175,12.2175"
          cx="80.6"
          cy="80.6"
          r="73.9"
        />
      </svg>
      <p></p>
      <p></p>
      
      <pb>Logowanie Prawidłowe!</pb>
      <div className="rivnopyszne">
      <button className="pyznewyjsz1" onClick={deleteUserProfile}>Chcesz opuścić profil Pyszny?</button>
      </div>
    </div>
  );
}

export default PyszneMain;
