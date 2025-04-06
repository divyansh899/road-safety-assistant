// Simple JavaScript for the Road Safety Assistant home page

// Function to handle feature button clicks
function alertFeature(feature) {
    if (feature === 'pothole') {
        fetchPotholes();
    } else if (feature === 'traffic') {
        alert('Traffic light status active! This feature would show you upcoming traffic lights and their current status.');
    }
}

// Function to fetch potholes from the server
function fetchPotholes() {
    // Show loading state
    const potholeButton = document.querySelector('button[onclick="alertFeature(\'pothole\')"]');
    const originalButtonText = potholeButton.textContent;
    potholeButton.textContent = 'Loading...';
    potholeButton.disabled = true;
    
    // Fetch pothole data from the server
    fetch('/api/potholes')
        .then(response => response.json())
        .then(potholes => {
            // Reset button
            potholeButton.textContent = originalButtonText;
            potholeButton.disabled = false;
            
            // Display the potholes
            displayPotholes(potholes);
        })
        .catch(error => {
            // Reset button
            potholeButton.textContent = originalButtonText;
            potholeButton.disabled = false;
            
            console.error('Error fetching potholes:', error);
            alert('Failed to fetch pothole data. Please try again.');
        });
}

// Function to display potholes
function displayPotholes(potholes) {
    // Create a simple modal to show the potholes
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.maxWidth = '80%';
    modalContent.style.maxHeight = '80%';
    modalContent.style.overflow = 'auto';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#4CAF50';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '8px 16px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.float = 'right';
    closeButton.onclick = () => document.body.removeChild(modal);
    
    // Add close button to modal content
    modalContent.appendChild(closeButton);
    
    // Create title
    const title = document.createElement('h2');
    title.textContent = 'Potholes in Database';
    title.style.marginBottom = '20px';
    modalContent.appendChild(title);
    
    // Create table for potholes
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Location (Lat, Long)', 'Severity', 'Description', 'Status', 'Reported At'];
    
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.padding = '10px';
        th.style.borderBottom = '1px solid #ddd';
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    if (potholes.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.textContent = 'No potholes found in the database.';
        emptyCell.colSpan = headers.length;
        emptyCell.style.padding = '10px';
        emptyCell.style.textAlign = 'center';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
    } else {
        // Add pothole data to table
        potholes.forEach(pothole => {
            const row = document.createElement('tr');
            
            // Location
            const locationCell = document.createElement('td');
            locationCell.textContent = `${pothole.latitude.toFixed(4)}, ${pothole.longitude.toFixed(4)}`;
            locationCell.style.padding = '10px';
            locationCell.style.borderBottom = '1px solid #ddd';
            row.appendChild(locationCell);
            
            // Severity
            const severityCell = document.createElement('td');
            severityCell.textContent = pothole.severity || 'Unknown';
            severityCell.style.padding = '10px';
            severityCell.style.borderBottom = '1px solid #ddd';
            
            // Set background color based on severity
            if (pothole.severity === 'high') {
                severityCell.style.backgroundColor = '#ffcccc';
            } else if (pothole.severity === 'medium') {
                severityCell.style.backgroundColor = '#ffffcc';
            } else if (pothole.severity === 'low') {
                severityCell.style.backgroundColor = '#ccffcc';
            }
            
            row.appendChild(severityCell);
            
            // Description
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = pothole.description || 'No description';
            descriptionCell.style.padding = '10px';
            descriptionCell.style.borderBottom = '1px solid #ddd';
            row.appendChild(descriptionCell);
            
            // Status
            const statusCell = document.createElement('td');
            statusCell.textContent = pothole.status || 'Unknown';
            statusCell.style.padding = '10px';
            statusCell.style.borderBottom = '1px solid #ddd';
            row.appendChild(statusCell);
            
            // Reported At
            const reportedAtCell = document.createElement('td');
            reportedAtCell.textContent = pothole.reportedAt ? new Date(pothole.reportedAt).toLocaleString() : 'Unknown';
            reportedAtCell.style.padding = '10px';
            reportedAtCell.style.borderBottom = '1px solid #ddd';
            row.appendChild(reportedAtCell);
            
            tbody.appendChild(row);
        });
    }
    
    table.appendChild(tbody);
    modalContent.appendChild(table);
    
    // Add modal content to modal
    modal.appendChild(modalContent);
    
    // Add modal to body
    document.body.appendChild(modal);
}

// Function to report a new pothole
function reportPothole() {
    // Check if geolocation is available
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }
    
    // Get current position
    navigator.geolocation.getCurrentPosition(
        position => {
            // Ask for pothole details
            const severity = prompt('Rate pothole severity (low, medium, high):', 'medium');
            const description = prompt('Describe the pothole:', '');
            
            if (severity !== null && description !== null) {
                // Send pothole data to server
                fetch('/api/potholes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        severity,
                        description
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Pothole reported successfully!');
                        // Refresh pothole list
                        fetchPotholes();
                    } else {
                        alert(data.message || 'Failed to report pothole.');
                    }
                })
                .catch(error => {
                    console.error('Error reporting pothole:', error);
                    alert('An error occurred while reporting the pothole.');
                });
            }
        },
        error => {
            console.error('Geolocation error:', error);
            alert('Failed to get your location. Please allow location access.');
        }
    );
}

// Simple page load animation
document.addEventListener('DOMContentLoaded', function() {
    // Make elements fade in when page loads
    const sections = document.querySelectorAll('section');
    
    sections.forEach(function(section, index) {
        // Add a slight delay for each section
        setTimeout(function() {
            section.style.opacity = '1';
        }, 300 * index);
    });
    
    // Update stats with real numbers from database
    updateStatsFromDatabase();
    
    // Add hover effect for feature boxes
    const featureBoxes = document.querySelectorAll('.feature-box');
    featureBoxes.forEach(function(box) {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.03)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add report button to pothole feature box
    const potholeFeatureBox = document.querySelector('.feature-box:first-child');
    const reportButton = document.createElement('button');
    reportButton.textContent = 'Report New Pothole';
    reportButton.style.marginTop = '10px';
    reportButton.style.backgroundColor = '#f44336';
    reportButton.onclick = reportPothole;
    potholeFeatureBox.appendChild(reportButton);
});

// Function to update stats from database
function updateStatsFromDatabase() {
    // Fetch pothole data
    fetch('/api/potholes')
        .then(response => response.json())
        .then(potholes => {
            // Update pothole stats
            const potholeCountElement = document.querySelector('.stat-box:nth-child(1) .stat-number');
            potholeCountElement.textContent = potholes.length;
            
            // Count traffic issues (potholes with high severity)
            const trafficIssuesElement = document.querySelector('.stat-box:nth-child(2) .stat-number');
            const trafficIssuesCount = potholes.filter(p => p.severity === 'high').length;
            trafficIssuesElement.textContent = trafficIssuesCount;
        })
        .catch(error => {
            console.error('Error fetching stats:', error);
        });
}

// Simple geolocation check
function checkLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude + 
    " Longitude: " + position.coords.longitude);
    // In a real app, this data would be used to check for nearby potholes
}

// Check location when page loads (commented out for now, uncomment to activate)
// checkLocation();

// Add simple hover effect for feature boxes
const featureBoxes = document.querySelectorAll('.feature-box');
featureBoxes.forEach(function(box) {
    box.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.03)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    box.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}); 