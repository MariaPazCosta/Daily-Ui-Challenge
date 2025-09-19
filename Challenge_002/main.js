// DOM Elements
const paymentForm = document.getElementById('paymentForm');
const cardNumberInput = document.getElementById('cardNumber');
const securityCodeInput = document.getElementById('securityCode');
const expiryInput = document.getElementById('expiry');
const cardNameInput = document.getElementById('cardName');
const termsCheckbox = document.getElementById('terms');
const submitButton = document.querySelector('.btn-submit');
const cancelButton = document.querySelector('.btn-cancel');

// Format card number with spaces
function formatCardNumber(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
        return parts.join(' ');
    } else {
        return v;
    }
}

// Format expiry date MM/YY
function formatExpiry(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
        return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    
    return v;
}

// Validate card number (basic Luhn algorithm)
function validateCardNumber(number) {
    const num = number.replace(/\s/g, '');
    if (num.length < 13 || num.length > 19) return false;
    
    let sum = 0;
    let alternate = false;
    
    for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num.charAt(i), 10);
        
        if (alternate) {
            n *= 2;
            if (n > 9) {
                n = (n % 10) + 1;
            }
        }
        
        sum += n;
        alternate = !alternate;
    }
    
    return (sum % 10) === 0;
}

// Validate expiry date
function validateExpiry(expiry) {
    if (expiry.length !== 5) return false;
    
    const [month, year] = expiry.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt('20' + year, 10);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) return false;
    
    return true;
}

// Validate security code
function validateSecurityCode(code) {
    return code.length >= 3 && code.length <= 4 && /^\d+$/.test(code);
}

// Validate form
function validateForm() {
    const cardNumber = cardNumberInput.value;
    const cardName = cardNameInput.value.trim();
    const securityCode = securityCodeInput.value;
    const expiry = expiryInput.value;
    const termsAccepted = termsCheckbox.checked;
    
    const isValidCard = validateCardNumber(cardNumber);
    const isValidName = cardName.length >= 2;
    const isValidSecurity = validateSecurityCode(securityCode);
    const isValidExpiry = validateExpiry(expiry);
    
    const isFormValid = isValidCard && isValidName && isValidSecurity && isValidExpiry && termsAccepted;
    
    submitButton.disabled = !isFormValid;
    return isFormValid;
}

// Add input event listeners
cardNumberInput.addEventListener('input', (e) => {
    e.target.value = formatCardNumber(e.target.value);
    validateForm();
});

expiryInput.addEventListener('input', (e) => {
    e.target.value = formatExpiry(e.target.value);
    validateForm();
});

securityCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    validateForm();
});

cardNameInput.addEventListener('input', () => {
    validateForm();
});

termsCheckbox.addEventListener('change', () => {
    validateForm();
});

// Handle form submission
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Show loading state
        submitButton.textContent = 'Procesando...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('¡Pago procesado exitosamente! Bienvenido al plan premium.');
            
            // Reset form
            paymentForm.reset();
            submitButton.textContent = 'Obtener Plan';
            submitButton.disabled = false;
            validateForm();
        }, 2000);
    }
});

// Handle cancel button
cancelButton.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres cancelar el pago?')) {
        paymentForm.reset();
        validateForm();
    }
});

// Add visual feedback for input validation
function addInputValidation() {
    const inputs = [cardNumberInput, cardNameInput, securityCodeInput, expiryInput];
    
    inputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            const value = e.target.value.trim();
            
            if (value) {
                let isValid = false;
                
                switch (e.target.id) {
                    case 'cardNumber':
                        isValid = validateCardNumber(value);
                        break;
                    case 'cardName':
                        isValid = value.length >= 2;
                        break;
                    case 'securityCode':
                        isValid = validateSecurityCode(value);
                        break;
                    case 'expiry':
                        isValid = validateExpiry(value);
                        break;
                }
                
                if (isValid) {
                    e.target.style.borderColor = '#9CAF88';
                    e.target.style.backgroundColor = 'rgba(156, 175, 136, 0.1)';
                } else {
                    e.target.style.borderColor = '#e53e3e';
                    e.target.style.backgroundColor = 'rgba(229, 62, 62, 0.1)';
                }
            } else {
                e.target.style.borderColor = '';
                e.target.style.backgroundColor = '';
            }
        });
        
        input.addEventListener('focus', (e) => {
            e.target.style.borderColor = '#9CAF88';
            e.target.style.backgroundColor = 'rgba(247, 206, 180, 0.8)';
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    validateForm();
    addInputValidation();
    
    // Add smooth animations
    const formContainer = document.querySelector('.payment-form-container');
    formContainer.style.opacity = '0';
    formContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        formContainer.style.transition = 'all 0.6s ease';
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 100);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (confirm('¿Quieres cancelar el proceso de pago?')) {
            paymentForm.reset();
            validateForm();
        }
    }
    
    if (e.key === 'Enter' && e.ctrlKey) {
        if (validateForm()) {
            paymentForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Prevent form submission on Enter key (except with Ctrl)
paymentForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
        e.preventDefault();
    }
});