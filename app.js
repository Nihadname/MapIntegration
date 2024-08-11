// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Simulated data
const fakeData = [
    { id: 1, name: 'House A', description: 'A lovely house in the city.', price: 500000, location: 'Downtown', lat: 51.5, lon: -0.09, image: 'https://via.placeholder.com/150', date: '2024-07-01' },
    { id: 2, name: 'House B', description: 'A beautiful house with a garden.', price: 750000, location: 'Suburbs', lat: 51.51, lon: -0.1, image: 'https://via.placeholder.com/150', date: '2024-06-15' },
    { id: 3, name: 'House C', description: 'A modern apartment with a view.', price: 600000, location: 'City Center', lat: 51.52, lon: -0.08, image: 'https://via.placeholder.com/150', date: '2024-08-01' }
];

// Initialize marker cluster group
const markers = L.markerClusterGroup();
map.addLayer(markers);

// Function to create and display cards with advanced styling
function displayCards(data) {
    const cardsContainer = document.getElementById('cards');
    cardsContainer.innerHTML = ''; // Clear existing cards
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p class="info">Price: $${item.price}</p>
            <p class="info">Location: ${item.location}</p>
            <p class="info">Date: ${item.date}</p>
        `;
        card.addEventListener('click', () => {
            focusOnLocation(item.lat, item.lon, item.name, item.description, item.price, item.date);
        });
        cardsContainer.appendChild(card);
    });

    // Add markers for all houses on the map
    addMarkers(data);
}

// Function to add markers to the map with clustering
function addMarkers(data) {
    markers.clearLayers(); // Clear previous markers

    data.forEach(item => {
        const marker = L.marker([item.lat, item.lon], { 
            icon: L.divIcon({ 
                className: 'custom-icon', 
                html: `<div style="background: red; width: 75px; height: 25px; border-radius: 30%; font-size:12px; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px;">$${item.price}</div>`, 
                iconSize: [45, 45], 
                iconAnchor: [22, 45] 
            }) 
        });
        marker.addTo(markers)
            .bindPopup(`
                <div style="width: 200px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 8px;">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <strong>Price:</strong> $${item.price}<br>
                    <strong>Location:</strong> ${item.location}<br>
                    <strong>Date:</strong> ${item.date}
                </div>
            `)
            .on('click', () => {
                focusOnLocation(item.lat, item.lon, item.name, item.description, item.price, item.date);
            });
    });

    // Adjust the map view to fit all markers
    map.fitBounds(markers.getBounds());
}

// Function to focus on a location on the map with enhanced popup
function focusOnLocation(lat, lon, name, description, price, date) {
    map.setView([lat, lon], 13); // Center the map at the specified location
}

// Function to handle search
function handleSearch(query) {
    const filteredData = fakeData.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    displayCards(filteredData);
}

// Function to handle price range filter
function handlePriceRange(minPrice, maxPrice) {
    const filteredData = fakeData.filter(item => item.price >= minPrice && item.price <= maxPrice);
    displayCards(filteredData);
}

// Function to handle date range filter
function handleDateRange(startDate, endDate) {
    const filteredData = fakeData.filter(item => new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate));
    displayCards(filteredData);
}

// Function to handle sorting
function handleSorting(sortBy) {
    const sortedData = [...fakeData].sort((a, b) => {
        if (sortBy === 'price') {
            return a.price - b.price;
        } else if (sortBy === 'date') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'location') {
            return a.location.localeCompare(b.location);
        }
        return 0;
    });
    displayCards(sortedData);
}

// Setup event listener for search
document.getElementById('search').addEventListener('input', (e) => {
    handleSearch(e.target.value);
});

// Setup event listener for price range filter
document.getElementById('price-range').addEventListener('input', (e) => {
    const [minPrice, maxPrice] = e.target.value.split('-').map(Number);
    handlePriceRange(minPrice, maxPrice);
});

// Setup event listener for date range filter
document.getElementById('date-range').addEventListener('input', (e) => {
    const [startDate, endDate] = e.target.value.split('to');
    handleDateRange(startDate.trim(), endDate.trim());
});

// Setup event listener for sorting
document.getElementById('sorting').addEventListener('change', (e) => {
    handleSorting(e.target.value);
});

// Function to add user's current location
function addUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            L.marker([latitude, longitude], { 
                icon: L.icon({ 
                    iconUrl: 'https://example.com/current-location-icon.png', // Replace with your custom icon URL
                    iconSize: [25, 41], 
                    iconAnchor: [12, 41] 
                }) 
            }).addTo(map)
              .bindPopup('Your Current Location')
              .openPopup();
            map.setView([latitude, longitude], 13);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Call function to add user location
addUserLocation();

// Load data and display cards on page load
displayCards(fakeData);
