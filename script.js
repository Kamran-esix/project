// UEAS Swat - 4 Campuses (Kabal Main Campus Priority)
const facilities = {
    kabal: [  // Main Campus Kabal (34.7605, 72.3678)
        { id: 1, name: "CSE Lab Complex", cat: "lab", lat: 34.7605, lng: 72.3678, desc: "Computer Science Labs (50+ PCs)", wheelchair: true, quiet: true, hours: "8AM-10PM" },
        { id: 2, name: "Central Library", cat: "library", lat: 34.7607, lng: 72.3680, desc: "Technical Library (10K+ books)", wheelchair: true, quiet: true, hours: "8AM-10PM" },
        { id: 3, name: "Main Lecture Hall", cat: "classroom", lat: 34.7603, lng: 72.3676, desc: "300 seats auditorium", wheelchair: true, quiet: false, hours: "Class Hours" },
        { id: 4, name: "VC Admin Block", cat: "admin", lat: 34.7608, lng: 72.3682, desc: "Vice Chancellor Office", wheelchair: true, quiet: false, hours: "9AM-5PM" },
        { id: 5, name: "Electrical Eng Labs", cat: "lab", lat: 34.7604, lng: 72.3675, desc: "EE Labs & Workshop", wheelchair: false, quiet: false, hours: "9AM-5PM" },
        { id: 6, name: "Campus Masjid", cat: "other", lat: 34.7606, lng: 72.3681, desc: "Prayer facility", wheelchair: true, quiet: true, hours: "5 Times" },
        { id: 7, name: "Student Cafeteria", cat: "other", lat: 34.7602, lng: 72.3679, desc: "Kabal Canteen", wheelchair: true, quiet: false, hours: "8AM-9PM" },
        { id: 8, name: "Seminar Hall", cat: "classroom", lat: 34.7610, lng: 72.3677, desc: "Conference room (150 seats)", wheelchair: true, quiet: true, hours: "Booked" },
        { id: 9, name: "Mechanical Workshop", cat: "lab", lat: 34.7601, lng: 72.3683, desc: "ME Labs", wheelchair: false, quiet: false, hours: "9AM-5PM" },
        { id: 10, name: "Sports Ground", cat: "other", lat: 34.7598, lng: 72.3674, desc: "Cricket/Football", wheelchair: true, quiet: false, hours: "All Day" }
    ],
    brikot: [  // Satellite Campus
        { id: 11, name: "Brikot Basic Lab", cat: "lab", lat: 34.7523, lng: 72.3751, desc: "Satellite lab facility", wheelchair: false, quiet: true, hours: "10AM-4PM" },
        { id: 12, name: "Brikot Classroom", cat: "classroom", lat: 34.7524, lng: 72.3752, desc: "Small classroom", wheelchair: false, quiet: false, hours: "Class Hours" }
    ],
    arcot: [  // Satellite Campus
        { id: 13, name: "Arcot Training Center", cat: "classroom", lat: 34.7489, lng: 72.3802, desc: "Training facility", wheelchair: false, quiet: true, hours: "Booked" },
    ],
    kalam: [  // Satellite Campus
        { id: 14, name: "Kalam Research Outpost", cat: "lab", lat: 35.4887, lng: 72.5842, desc: "Research station", wheelchair: false, quiet: true, hours: "Seasonal" }
    ]
};

let map, markers = [], currentCampus = 'kabal';

// Initialize - Focus on Kabal Main Campus
map = L.map('map').setView([34.7605, 72.3678], 17);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap | UEAS Swat Kabal Campus | ueas.edu.pk'
}).addTo(map);

addMarkers(facilities.kabal);

// Event Listeners
document.getElementById('campusFilter').addEventListener('change', e => {
    currentCampus = e.target.value;
    filterFacilities();
});
document.getElementById('search').addEventListener('input', filterFacilities);
document.getElementById('filter').addEventListener('change', filterFacilities);
document.getElementById('access').addEventListener('change', filterFacilities);
document.getElementById('locationBtn').addEventListener('click', getLocation);
document.querySelector('.close-btn').addEventListener('click', closePanel);

function addMarkers(facList) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    facList.forEach(fac => {
        const icon = L.divIcon({
            html: `<div style="background:${getColor(fac.cat)}; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:bold; box-shadow:0 2px 8px rgba(0,0,0,0.3);">${getIconLetter(fac.cat)}</div>`,
            iconSize: [32, 32], iconAnchor: [16, 32], className: ''
        });

        const marker = L.marker([fac.lat, fac.lng], { icon }).addTo(map);
        marker.fac = fac;
        marker.on('click', () => showInfo(fac));
        markers.push(marker);
    });
}

function getIconLetter(cat) {
    return { lab: 'L', classroom: 'C', library: 'B', admin: 'A', other: 'O' }[cat] || 'U';
}

function getColor(cat) {
    return {
        lab: '#ff5722', classroom: '#2196f3', library: '#4caf50',
        admin: '#9c27b0', other: '#ff9800'
    }[cat] || '#607d8b';
}

function filterFacilities() {
    const search = document.getElementById('search').value.toLowerCase();
    const cat = document.getElementById('filter').value;
    const access = document.getElementById('access').value;

    let filtered = facilities[currentCampus].filter(f =>
        (!search || f.name.toLowerCase().includes(search) || f.desc.toLowerCase().includes(search)) &&
        (!cat || f.cat === cat) &&
        (!access || (access === 'wheelchair' ? f.wheelchair : true))
    );
    addMarkers(filtered);

    // Auto-fit map to markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function showInfo(fac) {
    document.getElementById('facilityInfo').innerHTML = `
        <div class="facility-card">
            <h3><span class="campus-badge">${currentCampus.toUpperCase()}</span> ${fac.name}</h3>
            <p>${fac.desc}</p>
            <p><strong>Hours:</strong> ${fac.hours}</p>
            <div>
                ${fac.wheelchair ? '<span class="tag wheelchair">Wheelchair OK</span>' : ''}
                ${fac.quiet ? '<span class="tag quiet">Quiet Zone</span>' : ''}
                ${fac.hours.includes('All') || fac.hours.includes('24') ? '<span class="tag open">24/7</span>' : ''}
            </div>
            <button class="btn" onclick="getDirections('${fac.lat}','${fac.lng}','${fac.name} - ${currentCampus.toUpperCase()}')">
                <i class="fas fa-directions"></i> Google Maps
            </button>
            <small>ueas.edu.pk | Kabal Main Campus Priority</small>
        </div>
    `;
    document.getElementById('infoPanel').classList.add('open');
    map.setView([fac.lat, fac.lng], 19);
}

function closePanel() {
    document.getElementById('infoPanel').classList.remove('open');
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(
        pos => {
            const latlng = [pos.coords.latitude, pos.coords.longitude];
            map.setView(latlng, 18);
            L.circleMarker(latlng, { radius: 12, color: '#ffd700', fillOpacity: 0.7, weight: 4 })
                .addTo(map).bindPopup('<b>You are here!</b><br><em>UEAS Swat Campus</em>').openPopup();
        },
        () => alert('Enable location for campus navigation!')
    );
}

function getDirections(lat, lng, name) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
    window.open(url, '_blank');
}