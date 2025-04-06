document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Show loading state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Logging in...';
            submitButton.disabled = true;
            
            // Send login request to server
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                if (data.success) {
                    // Login successful
                    alert('Login successful!');
                    
                    // Redirect to home page
                    window.location.href = 'home.html';
                } else {
                    // Login failed
                    alert(data.message || 'Login failed. Please check your credentials.');
                }
            })
            .catch(error => {
                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                console.error('Login error:', error);
                alert('An error occurred during login. Please try again.');
            });
        });
    }
    
    // Add subtle animations for inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}); 