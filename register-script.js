document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        // Add password strength indicator to password field
        const passwordField = document.getElementById('password');
        const passwordContainer = passwordField.parentElement;
        
        // Create password strength elements
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        
        const strengthMeter = document.createElement('div');
        strengthMeter.className = 'password-strength-meter';
        
        strengthIndicator.appendChild(strengthMeter);
        passwordContainer.appendChild(strengthIndicator);
        
        // Track password strength
        passwordField.addEventListener('input', () => {
            const password = passwordField.value;
            updatePasswordStrength(password, strengthMeter);
        });
        
        // Simplified form submission
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Basic validation
            if (!fullname || !email || !username || !password) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Check if passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Show loading state
            const submitBtn = document.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
            
            // Create user data object
            const formData = {
                fullname: fullname,
                email: email,
                username: username,
                password: password
            };
            
            // Send registration request
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful! You can now log in.');
                    window.location.href = '/';
                } else {
                    alert('Registration failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register';
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

// Helper function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('error');
    
    // Check if error message element already exists
    let errorElement = field.parentElement.querySelector('.error-message');
    
    if (!errorElement) {
        // Create error message element
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentElement.appendChild(errorElement);
    }
    
    // Set error message
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Helper function to remove all errors
function removeAllErrors() {
    // Remove error classes
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    // Hide error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.style.display = 'none');
}

// Helper function to update password strength
function updatePasswordStrength(password, meterElement) {
    if (!password) {
        meterElement.className = 'password-strength-meter';
        meterElement.style.width = '0';
        return;
    }
    
    // Calculate password strength
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1; // Has uppercase
    if (/[a-z]/.test(password)) strength += 1; // Has lowercase
    if (/[0-9]/.test(password)) strength += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Has special char
    
    // Update meter
    if (strength <= 2) {
        meterElement.className = 'password-strength-meter weak';
    } else if (strength <= 4) {
        meterElement.className = 'password-strength-meter medium';
    } else {
        meterElement.className = 'password-strength-meter strong';
    }
} 