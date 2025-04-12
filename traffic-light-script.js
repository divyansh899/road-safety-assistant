// Function to load all traffic light reports
async function loadReports() {
    try {
        const response = await fetch('/api/traffic-lights');
        const reports = await response.json();
        const reportsList = document.getElementById('reportsList');
        reportsList.innerHTML = '';

        reports.forEach(report => {
            const reportElement = document.createElement('div');
            reportElement.className = 'list-group-item';
            reportElement.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${report.location}</h5>
                    <small class="text-${getStatusColor(report.status)}">${report.status}</small>
                </div>
                <p class="mb-1">Issue Type: ${formatIssueType(report.issueType)}</p>
                ${report.description ? `<p class="mb-1">${report.description}</p>` : ''}
                <small>Reported on: ${new Date(report.timestamp).toLocaleString()}</small>
            `;
            reportsList.appendChild(reportElement);
        });
    } catch (error) {
        console.error('Error loading reports:', error);
        alert('Failed to load reports. Please try again later.');
    }
}

// Helper function to get status color
function getStatusColor(status) {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'in_progress':
            return 'info';
        case 'resolved':
            return 'success';
        default:
            return 'secondary';
    }
}

// Helper function to format issue type
function formatIssueType(issueType) {
    return issueType.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Handle form submission
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const location = document.getElementById('location').value;
    const issueType = document.getElementById('issueType').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('/api/traffic-lights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                location,
                issueType,
                description
            })
        });

        if (response.ok) {
            alert('Report submitted successfully!');
            document.getElementById('reportForm').reset();
            loadReports(); // Refresh the reports list
        } else {
            throw new Error('Failed to submit report');
        }
    } catch (error) {
        console.error('Error submitting report:', error);
        alert('Failed to submit report. Please try again later.');
    }
});

// Load reports when the page loads
document.addEventListener('DOMContentLoaded', loadReports); 