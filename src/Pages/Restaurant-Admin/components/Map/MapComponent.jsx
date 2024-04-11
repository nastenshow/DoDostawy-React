import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import Base64 from 'crypto-js/enc-base64';

const MapComponent = () => {
    const [accessToken, setAccessToken] = useState(null);

    const centerPosition = [50.0412, 21.9991];
    const markerPosition = [50.0412, 21.9991];
 

    const polygonPoints = [
        [50.0452, 21.9851],
        [50.0502, 21.9951],
        [50.0402, 22.0051],
        [50.0352, 21.9951]
    ];

    const getAccessToken = async () => {
        try {
            const response = await axios.post('https://api.openstreetmap.org/oauth/token_endpoint', {
                client_id: 'WsZ63BkjnJHMhNyy40__P52n-lAIr35bNQjojAZjr5k',
                client_secret: 'heYw76tC4vm0ibnf6TsOnYqBvM8KNLZ6cZ0r1Cr5mUY',
                grant_type: 'client_credentials'
            });
    
            setAccessToken(response.data.access_token);
        } catch (error) {
            console.error("Помилка при отриманні токену:", error);
        }
    };
    
    const fetchData = async () => {
        if (!accessToken) return;
    
        try {
            const response = await axios.get('https://api.openstreetmap.org/path_to_endpoint', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
    
            setMapData(response.data);
        } catch (error) {
            console.error("Помилка при завантаженні даних:", error);
        }
    };
    
    useEffect(() => {
        getAccessToken();
    }, []);
    
    useEffect(() => {
        if (accessToken) {
            fetchData();
        }
    }, [accessToken]);

    return (
        <MapContainer center={centerPosition} zoom={13} style={{ width: '100%', height: '400px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={markerPosition}>
                <Popup>Ресторан</Popup>
            </Marker>
            <Polygon positions={polygonPoints} color="green" />

            {/* Тут ви можете додати додаткову логіку для відображення отриманих даних з API, якщо потрібно */}
        </MapContainer>
    );
}

export default MapComponent;