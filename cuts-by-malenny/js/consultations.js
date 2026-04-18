// Client Consultations JavaScript

const API_URL = window.location.origin + '/api';
let selectedCustomer = null;

// Check auth
const token = localStorage.getItem('adminToken');
if (!token) {
    window.location.href = 'admin-login.html';
}

// Client search
const clientSearch = document.getElementById('clientSearch');
const clientResults = document.getElementById('clientResults');
let searchTimeout;

clientSearch?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        clientResults.classList.remove('visible');
        return;
    }
    
    searchTimeout = setTimeout(() => searchClients(query), 300);
});

async function searchClients(query) {
    try {
        // Search through appointments to find customers
        const response = await fetch(`${API_URL}/admin/appointments?search=${encodeURIComponent(query)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Search failed');
        
        const appointments = await response.json();
        const uniqueCustomers = {};
        
        appointments.forEach(appt => {
            if (!uniqueCustomers[appt.customer_id]) {
                uniqueCustomers[appt.customer_id] = {
                    id: appt.customer_id,
                    firstName: appt.first_name,
                    lastName: appt.last_name,
                    phone: appt.phone,
                    email: appt.email
                };
            }
        });
        
        displayClientResults(Object.values(uniqueCustomers));
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displayClientResults(customers) {
    if (customers.length === 0) {
        clientResults.innerHTML = '<div class="client-result-item">No clients found</div>';
    } else {
        clientResults.innerHTML = customers.map(c => `
            <div class="client-result-item" onclick="selectClient('${c.id}', '${c.firstName}', '${c.lastName}', '${c.phone}', '${c.email}')">
                <strong>${c.firstName} ${c.lastName}</strong><br>
                <small>${c.phone} | ${c.email}</small>
            </div>
        `).join('');
    }
    clientResults.classList.add('visible');
}

async function selectClient(id, firstName, lastName, phone, email) {
    selectedCustomer = { id, firstName, lastName, phone, email };
    
    document.getElementById('customerId').value = id;
    document.getElementById('chemicalCustomerId').value = id;
    document.getElementById('clientName').textContent = `${firstName} ${lastName}`;
    document.getElementById('clientContact').textContent = `${phone} | ${email}`;
    document.getElementById('selectedClientInfo').style.display = 'block';
    
    clientResults.classList.remove('visible');
    clientSearch.value = '';
    
    // Load client data
    await loadAllergyAlerts(id);
    await loadHistory(id);
    await loadFormulaTemplates();
}

async function loadAllergyAlerts(customerId) {
    try {
        const response = await fetch(`${API_URL}/admin/customers/${customerId}/allergy-alerts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to load allergy alerts');
        
        const alerts = await response.json();
        const container = document.getElementById('allergyAlerts');
        
        if (alerts.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = alerts.map(a => `
            <div class="allergy-alert ${a.severity === 'severe' ? 'severe' : ''}">
                <h4>⚠️ ${a.severity.toUpperCase()} ALLERGY: ${a.allergen_type}</h4>
                <p><strong>${a.allergen_name || 'Unknown'}</strong></p>
                <p>${a.alert_message || a.reaction_description}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading allergy alerts:', error);
    }
}

async function loadHistory(customerId) {
    try {
        // Load consultations
        const consultResponse = await fetch(`${API_URL}/admin/customers/${customerId}/consultations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (consultResponse.ok) {
            const consultations = await consultResponse.json();
            const consultList = document.getElementById('consultationList');
            
            if (consultations.length === 0) {
                consultList.innerHTML = '<p>No consultations on record.</p>';
            } else {
                consultList.innerHTML = consultations.map(c => `
                    <div class="chemical-service-card">
                        <h4>${c.consultation_type === 'initial' ? 'Initial' : 'Follow-up'} Consultation</h4>
                        <p class="meta">${new Date(c.consultation_date).toLocaleDateString()} | By: ${c.performed_by || 'Unknown'}</p>
                        <p><strong>Hair:</strong> ${c.hair_type || 'N/A'} ${c.hair_texture || ''} | <strong>Scalp:</strong> ${c.scalp_condition || 'N/A'}</p>
                        <p><strong>Goals:</strong> ${c.desired_outcome || 'N/A'}</p>
                        ${c.recommendations ? `<p><strong>Recommendations:</strong> ${c.recommendations}</p>` : ''}
                    </div>
                `).join('');
            }
        }
        
        // Load chemical services
        const chemicalResponse = await fetch(`${API_URL}/admin/customers/${customerId}/chemical-services`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (chemicalResponse.ok) {
            const services = await chemicalResponse.json();
            const chemicalList = document.getElementById('chemicalList');
            
            if (services.length === 0) {
                chemicalList.innerHTML = '<p>No chemical services on record.</p>';
            } else {
                chemicalList.innerHTML = services.map(s => `
                    <div class="chemical-service-card">
                        <h4>${s.service_type.replace(/_/g, ' ').toUpperCase()}</h4>
                        <p class="meta">${new Date(s.service_date).toLocaleDateString()}</p>
                        <div class="formula">${s.formula}</div>
                        <p><strong>Brand:</strong> ${s.brand_name || 'N/A'} | <strong>Dev:</strong> ${s.developer_volume || 'N/A'}</p>
                        <p><strong>Result:</strong> ${s.result_color || 'N/A'} ${s.client_satisfaction ? `<span class="satisfaction-stars">${'★'.repeat(s.client_satisfaction)}</span>` : ''}</p>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

async function loadFormulaTemplates() {
    try {
        const response = await fetch(`${API_URL}/admin/formula-templates`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to load templates');
        
        const templates = await response.json();
        const container = document.getElementById('formulaTemplates');
        
        if (templates.length === 0) {
            container.innerHTML = '<p>No formula templates yet. Create some in the admin panel.</p>';
            return;
        }
        
        container.innerHTML = templates.map(t => `
            <div class="formula-template-card ${t.is_favorite ? 'favorite' : ''}" onclick="applyFormulaTemplate('${t.formula}', '${t.developer_volume || ''}', '${t.mixing_ratio || ''}', '${t.processing_time_minutes || ''}')">
                <h4>${t.name}</h4>
                <div class="formula">${t.formula}</div>
                <small>${t.brand_name || ''} ${t.developer_volume ? '| ' + t.developer_volume : ''}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading formula templates:', error);
    }
}

function applyFormulaTemplate(formula, developer, ratio, time) {
    document.querySelector('[name="formula"]').value = formula;
    if (developer) document.querySelector('[name="developerVolume"]').value = developer;
    if (ratio) document.querySelector('[name="mixingRatio"]').value = ratio;
    if (time) document.querySelector('[name="processingTimeMinutes"]').value = time;
}

// Tab switching
function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Previous service toggles
document.getElementById('previousColor')?.addEventListener('change', (e) => {
    document.getElementById('colorDetails').classList.toggle('visible', e.target.checked);
});

document.getElementById('previousRelaxer')?.addEventListener('change', (e) => {
    document.getElementById('relaxerDetails').classList.toggle('visible', e.target.checked);
});

document.getElementById('previousPerm')?.addEventListener('change', (e) => {
    document.getElementById('permDetails').classList.toggle('visible', e.target.checked);
});

document.getElementById('previousBleach')?.addEventListener('change', (e) => {
    document.getElementById('bleachDetails').classList.toggle('visible', e.target.checked);
});

document.getElementById('hasAllergies')?.addEventListener('change', (e) => {
    document.getElementById('allergyDetailsSection').style.display = e.target.checked ? 'block' : 'none';
});

// Set today's date for chemical service
document.getElementById('serviceDate').valueAsDate = new Date();

// Form submissions
document.getElementById('consultationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        customerId: formData.get('customerId'),
        consultationType: formData.get('consultationType'),
        performedBy: formData.get('performedBy'),
        hairType: formData.get('hairType'),
        hairTexture: formData.get('hairTexture'),
        hairDensity: formData.get('hairDensity'),
        hairCondition: formData.get('hairCondition'),
        scalpCondition: formData.get('scalpCondition'),
        previousColor: formData.get('previousColor') === 'on',
        previousColorDate: formData.get('previousColorDate'),
        previousColorNotes: formData.get('previousColorNotes'),
        previousRelaxer: formData.get('previousRelaxer') === 'on',
        previousRelaxerDate: formData.get('previousRelaxerDate'),
        previousRelaxerNotes: formData.get('previousRelaxerNotes'),
        previousPerm: formData.get('previousPerm') === 'on',
        previousPermDate: formData.get('previousPermDate'),
        previousPermNotes: formData.get('previousPermNotes'),
        previousBleach: formData.get('previousBleach') === 'on',
        previousBleachDate: formData.get('previousBleachDate'),
        previousBleachNotes: formData.get('previousBleachNotes'),
        hasAllergies: formData.get('hasAllergies') === 'on',
        allergyDetails: formData.get('allergyDetails'),
        sensitiveScalp: formData.get('sensitiveScalp') === 'on',
        desiredOutcome: formData.get('desiredOutcome'),
        lifestyleNotes: formData.get('lifestyleNotes'),
        maintenanceCommitment: formData.get('maintenanceCommitment'),
        notes: formData.get('notes'),
        recommendations: formData.get('recommendations')
    };
    
    try {
        const response = await fetch(`${API_URL}/admin/consultations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to save consultation');
        
        alert('Consultation saved successfully!');
        e.target.reset();
        document.getElementById('customerId').value = selectedCustomer.id;
        await loadHistory(selectedCustomer.id);
    } catch (error) {
        console.error('Error saving consultation:', error);
        alert('Failed to save consultation. Please try again.');
    }
});

document.getElementById('chemicalForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        customerId: formData.get('customerId'),
        serviceType: formData.get('serviceType'),
        serviceDate: formData.get('serviceDate'),
        brandName: formData.get('brandName'),
        productLine: formData.get('productLine'),
        formula: formData.get('formula'),
        developerVolume: formData.get('developerVolume'),
        mixingRatio: formData.get('mixingRatio'),
        processingTimeMinutes: parseInt(formData.get('processingTimeMinutes')) || null,
        applicationMethod: formData.get('applicationMethod'),
        processingNotes: formData.get('processingNotes'),
        resultColor: formData.get('resultColor'),
        resultNotes: formData.get('resultNotes'),
        clientSatisfaction: parseInt(formData.get('clientSatisfaction')) || null,
        nextServiceRecommended: formData.get('nextServiceRecommended'),
        nextServiceType: formData.get('nextServiceType'),
        homeCareInstructions: formData.get('homeCareInstructions'),
        serviceCost: parseFloat(formData.get('serviceCost')) || null,
        productCost: parseFloat(formData.get('productCost')) || null
    };
    
    try {
        const response = await fetch(`${API_URL}/admin/chemical-services`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to save chemical service');
        
        alert('Chemical service record saved successfully!');
        e.target.reset();
        document.getElementById('chemicalCustomerId').value = selectedCustomer.id;
        document.getElementById('serviceDate').valueAsDate = new Date();
        await loadHistory(selectedCustomer.id);
    } catch (error) {
        console.error('Error saving chemical service:', error);
        alert('Failed to save chemical service record. Please try again.');
    }
});

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
}
