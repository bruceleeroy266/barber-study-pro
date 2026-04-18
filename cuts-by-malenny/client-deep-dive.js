// Client Deep Dive JavaScript - Cuts by Malenny

// Mock data for demonstration
const mockClients = [
    {
        id: 1,
        name: "Sarah Johnson",
        phone: "(405) 555-0123",
        email: "sarah.j@email.com",
        totalVisits: 12,
        chemicalCount: 4,
        lastVisit: "2026-03-15",
        clientSince: "2024-08-10",
        hasAllergies: true,
        noShows: 1,
        hairProfile: {
            type: "Fine, straight",
            condition: "Color-treated, slight dryness on ends",
            porosity: "Medium",
            density: "Medium"
        },
        allergies: [
            { item: "PPD (paraphenylenediamine)", severity: "severe", note: "Reaction at previous salon" },
            { item: "Ammonia", severity: "mild", note: "Minor scalp irritation" }
        ],
        hairGoals: "Maintain blonde balayage, grow out to shoulder length, keep healthy",
        latestConsultation: {
            date: "2026-03-15",
            notes: "Wants to go slightly lighter for summer. Ends need trim. Recommended Olaplex treatment.",
            recommendations: "Full highlights with balayage technique, trim 1 inch, deep conditioning treatment"
        },
        chemicalHistory: [
            {
                date: "2026-03-15",
                type: "Highlights",
                formula: "7N + 20vol (1:1)\\nToner: 9V + 9GB (2:1) with 10vol",
                developer: "20vol / 10vol",
                processTime: "35 min / 15 min",
                startingLevel: "Level 7 with previous highlights",
                endingLevel: "Level 9 cool blonde",
                satisfaction: 5,
                notes: "Beautiful lift, client loved it"
            },
            {
                date: "2026-01-20",
                type: "Color",
                formula: "Root touch: 6N + 7N (1:1) with 20vol\\nGloss: Redken Shades EQ 09V",
                developer: "20vol",
                processTime: "30 min / 10 min",
                startingLevel: "Level 6 regrowth",
                endingLevel: "Level 7 natural",
                satisfaction: 4,
                notes: "Slightly darker than expected but client happy"
            }
        ],
        appointments: [
            { date: "2026-03-15", service: "Highlights & Cut", status: "completed", notes: "Full balayage, trim", satisfaction: 5 },
            { date: "2026-02-01", service: "Trim", status: "completed", notes: "Maintenance trim", satisfaction: 5 },
            { date: "2026-01-20", service: "Root Touch & Gloss", status: "completed", notes: "Color refresh", satisfaction: 4 },
            { date: "2025-12-10", service: "Highlights", status: "noshow", notes: "Called to reschedule", satisfaction: null },
            { date: "2025-11-15", service: "Cut & Style", status: "completed", notes: "", satisfaction: 5 }
        ]
    },
    {
        id: 2,
        name: "Maria Garcia",
        phone: "(405) 555-0456",
        email: "maria.g@email.com",
        totalVisits: 8,
        chemicalCount: 2,
        lastVisit: "2026-04-02",
        clientSince: "2025-02-20",
        hasAllergies: false,
        noShows: 0,
        hairProfile: {
            type: "Thick, curly",
            condition: "Healthy, occasional frizz",
            porosity: "Low",
            density: "High"
        },
        allergies: [],
        hairGoals: "Define curls, reduce frizz, maintain length",
        latestConsultation: {
            date: "2026-04-02",
            notes: "Interested in trying a curl-defining treatment. Open to product recommendations.",
            recommendations: "Curl cream, diffuser drying technique, trim every 8 weeks"
        },
        chemicalHistory: [
            {
                date: "2025-08-15",
                type: "Keratin Treatment",
                formula: "Brazilian Blowout Original",
                developer: "N/A",
                processTime: "90 min",
                startingLevel: "Natural curly, frizzy",
                endingLevel: "Smooth, reduced curl pattern",
                satisfaction: 5,
                notes: "Amazing results, lasted 3 months"
            }
        ],
        appointments: [
            { date: "2026-04-02", service: "Curly Cut", status: "completed", notes: "Devacut technique", satisfaction: 5 },
            { date: "2026-02-15", service: "Trim", status: "completed", notes: "", satisfaction: 5 },
            { date: "2025-12-20", service: "Deep Condition", status: "completed", notes: "Olaplex treatment", satisfaction: 5 }
        ]
    }
];

let currentClient = null;

// Search functionality
function searchClient() {
    const query = document.getElementById('clientSearch').value.toLowerCase();
    const resultsContainer = document.getElementById('clientResults');
    const deepDiveView = document.getElementById('deepDiveView');
    
    // Filter clients
    const filtered = mockClients.filter(client => 
        client.name.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.email.toLowerCase().includes(query)
    );
    
    // Apply additional filters
    const filterNoShows = document.getElementById('filterNoShows').checked;
    const filterAllergies = document.getElementById('filterAllergies').checked;
    const filterChemical = document.getElementById('filterChemical').checked;
    
    const finalResults = filtered.filter(client => {
        if (filterNoShows && client.noShows === 0) return false;
        if (filterAllergies && !client.hasAllergies) return false;
        if (filterChemical && client.chemicalCount === 0) return false;
        return true;
    });
    
    // Display results
    if (finalResults.length === 0) {
        resultsContainer.innerHTML = '<p class="empty-state">No clients found</p>';
    } else {
        resultsContainer.innerHTML = finalResults.map(client => `
            <div class="client-card" onclick="loadClient(${client.id})">
                <div class="client-card-info">
                    <h3>${client.name}</h3>
                    <p>${client.phone} • ${client.email}</p>
                </div>
                <div class="client-card-tags">
                    ${client.hasAllergies ? '<span class="tag tag-allergy">⚠️ Allergies</span>' : ''}
                    ${client.noShows > 0 ? `<span class="tag tag-noshow">No-Show (${client.noShows})</span>` : ''}
                    ${client.chemicalCount > 0 ? '<span class="tag tag-chemical">🧪 Chemical History</span>' : ''}
                </div>
            </div>
        `).join('');
    }
    
    // Hide deep dive view when searching
    deepDiveView.style.display = 'none';
}

// Load client deep dive
function loadClient(clientId) {
    currentClient = mockClients.find(c => c.id === clientId);
    if (!currentClient) return;
    
    const deepDiveView = document.getElementById('deepDiveView');
    const resultsContainer = document.getElementById('clientResults');
    
    // Hide results, show deep dive
    resultsContainer.innerHTML = '';
    deepDiveView.style.display = 'block';
    
    // Update header
    document.getElementById('clientName').textContent = currentClient.name;
    document.getElementById('clientPhone').textContent = `📞 ${currentClient.phone}`;
    document.getElementById('clientEmail').textContent = `✉️ ${currentClient.email}`;
    document.getElementById('totalVisits').textContent = currentClient.totalVisits;
    document.getElementById('chemicalCount').textContent = currentClient.chemicalCount;
    document.getElementById('lastVisit').textContent = formatDate(currentClient.lastVisit);
    document.getElementById('clientSince').textContent = formatDate(currentClient.clientSince);
    
    // Update tags
    const tagsContainer = document.getElementById('clientTags');
    tagsContainer.innerHTML = '';
    if (currentClient.hasAllergies) {
        tagsContainer.innerHTML += '<span class="tag tag-allergy">⚠️ Has Allergies</span>';
    }
    if (currentClient.noShows > 0) {
        tagsContainer.innerHTML += `<span class="tag tag-noshow">${currentClient.noShows} No-Show${currentClient.noShows > 1 ? 's' : ''}</span>`;
    }
    
    // Update alerts banner
    const alertsBanner = document.getElementById('alertsBanner');
    let alertsHTML = '';
    if (currentClient.allergies && currentClient.allergies.length > 0) {
        const severeAllergies = currentClient.allergies.filter(a => a.severity === 'severe');
        if (severeAllergies.length > 0) {
            alertsHTML += `<div class="alert alert-danger">
                <strong>⚠️ SEVERE ALLERGY:</strong> ${severeAllergies.map(a => a.item).join(', ')}
            </div>`;
        }
    }
    if (currentClient.noShows > 0) {
        alertsHTML += `<div class="alert alert-warning">
            <strong>⚠️ NO-SHOW HISTORY:</strong> ${currentClient.noShows} missed appointment${currentClient.noShows > 1 ? 's' : ''}. Consider requiring deposit.
        </div>`;
    }
    alertsBanner.innerHTML = alertsHTML;
    
    // Update hair profile
    const hairProfileSection = document.getElementById('hairProfile');
    if (currentClient.hairProfile) {
        hairProfileSection.innerHTML = `
            <div class="profile-item">
                <label>Hair Type</label>
                <p>${currentClient.hairProfile.type}</p>
            </div>
            <div class="profile-item">
                <label>Condition</label>
                <p>${currentClient.hairProfile.condition}</p>
            </div>
            <div class="profile-item">
                <label>Porosity</label>
                <p>${currentClient.hairProfile.porosity}</p>
            </div>
            <div class="profile-item">
                <label>Density</label>
                <p>${currentClient.hairProfile.density}</p>
            </div>
        `;
    } else {
        hairProfileSection.innerHTML = '<p class="empty-state">No hair profile recorded yet</p>';
    }
    
    // Update allergies
    const allergiesSection = document.getElementById('allergiesSection');
    if (currentClient.allergies && currentClient.allergies.length > 0) {
        allergiesSection.innerHTML = currentClient.allergies.map(allergy => `
            <div class="profile-item">
                <label style="color: ${allergy.severity === 'severe' ? 'var(--danger-color)' : 'var(--warning-color)'};">
                    ${allergy.severity === 'severe' ? '🔴' : '🟡'} ${allergy.item} (${allergy.severity.toUpperCase()})
                </label>
                <p>${allergy.note}</p>
            </div>
        `).join('');
    } else {
        allergiesSection.innerHTML = '<p class="empty-state">No allergies recorded</p>';
    }
    
    // Update hair goals
    const hairGoalsSection = document.getElementById('hairGoals');
    if (currentClient.hairGoals) {
        hairGoalsSection.innerHTML = `<p>${currentClient.hairGoals}</p>`;
    } else {
        hairGoalsSection.innerHTML = '<p class="empty-state">No goals recorded yet</p>';
    }
    
    // Update latest consultation
    const consultationSection = document.getElementById('latestConsultation');
    if (currentClient.latestConsultation) {
        consultationSection.innerHTML = `
            <div class="profile-item">
                <label>Date</label>
                <p>${formatDate(currentClient.latestConsultation.date)}</p>
            </div>
            <div class="profile-item">
                <label>Notes</label>
                <p>${currentClient.latestConsultation.notes}</p>
            </div>
            <div class="profile-item">
                <label>Recommendations</label>
                <p>${currentClient.latestConsultation.recommendations}</p>
            </div>
        `;
    } else {
        consultationSection.innerHTML = '<p class="empty-state">No consultation on record</p>';
    }
    
    // Update chemical timeline
    const timelineSection = document.getElementById('chemicalTimeline');
    if (currentClient.chemicalHistory && currentClient.chemicalHistory.length > 0) {
        timelineSection.innerHTML = currentClient.chemicalHistory.map(service => `
            <div class="timeline-item">
                <div class="timeline-date">${formatDate(service.date)}</div>
                <div class="timeline-content">
                    <h4>${service.type}</h4>
                    <div class="formula-box">${service.formula.replace(/\\n/g, '<br>')}</div>
                    <p><strong>Developer:</strong> ${service.developer}</p>
                    <p><strong>Process Time:</strong> ${service.processTime}</p>
                    <p><strong>Starting:</strong> ${service.startingLevel}</p>
                    <p><strong>Ending:</strong> ${service.endingLevel}</p>
                    ${service.notes ? `<p><strong>Notes:</strong> ${service.notes}</p>` : ''}
                    <div class="rating-stars">${'★'.repeat(service.satisfaction)}${'☆'.repeat(5 - service.satisfaction)}</div>
                </div>
            </div>
        `).join('');
    } else {
        timelineSection.innerHTML = '<p class="empty-state">No chemical services recorded</p>';
    }
    
    // Update appointment history
    const historyTable = document.getElementById('appointmentHistory').querySelector('tbody');
    if (currentClient.appointments && currentClient.appointments.length > 0) {
        historyTable.innerHTML = currentClient.appointments.map(appt => `
            <tr>
                <td>${formatDate(appt.date)}</td>
                <td>${appt.service}</td>
                <td><span class="status-badge status-${appt.status}">${appt.status}</span></td>
                <td>${appt.notes || '-'}</td>
                <td>${appt.satisfaction ? '★'.repeat(appt.satisfaction) : '-'}</td>
            </tr>
        `).join('');
    } else {
        historyTable.innerHTML = '<tr><td colspan="5" class="empty-state">No appointment history</td></tr>';
    }
}

// Modal functions
function bookAppointment() {
    document.getElementById('bookModal').style.display = 'flex';
    document.getElementById('bookDate').valueAsDate = new Date();
}

function addConsultation() {
    document.getElementById('consultationModal').style.display = 'flex';
}

function recordChemicalService() {
    document.getElementById('chemicalModal').style.display = 'flex';
    document.getElementById('chemicalDate').valueAsDate = new Date();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function printSummary() {
    window.print();
}

// Form submissions
document.getElementById('bookForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Appointment booked! (This would save to database)');
    closeModal('bookModal');
});

document.getElementById('consultationForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Consultation saved! (This would save to database)');
    closeModal('consultationModal');
});

document.getElementById('chemicalForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Chemical service recorded! (This would save to database)');
    closeModal('chemicalModal');
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Search on Enter key
document.getElementById('clientSearch')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchClient();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Focus search box on load
    document.getElementById('clientSearch')?.focus();
});
