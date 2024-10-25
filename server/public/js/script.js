const socket = io();

// Track the user's geolocation and emit it to the server
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Initialize the map centered over India
const map = L.map("map").setView([0, 0], 10);  

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'vishvajeet shukla'
}).addTo(map);

// Vishu's live location marker
let userMarker;

// Track markers for all users by their socket IDs
const markers = {};

// Update the user's own location on the map
socket.on("locationUpdate", ({ latitude, longitude }) => {
    if (userMarker) {
        userMarker.setLatLng([latitude, longitude]);  // Update user's marker location
    } else {
        userMarker = L.marker([latitude, longitude]).addTo(map);  // Create a marker for the user
    }

    map.setView([latitude, longitude], 13);  // Optionally pan to the user's location
});

// Handle receiving other users' locations
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);  // Center the map on the other user's location
    
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);  // Update the existing marker
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);  // Create a new marker for this user
    }
});
