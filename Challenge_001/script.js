// Funcionalidad del checkbox personalizado
const checkbox = document.getElementById('termsCheckbox');
const checkboxLabel = document.querySelector('.checkbox-label');

function toggleCheckbox() {
    checkbox.classList.toggle('checked');
}

// Event listeners para el checkbox
checkbox.addEventListener('click', toggleCheckbox);
checkboxLabel.addEventListener('click', toggleCheckbox);

// Manejo del formulario
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar que se acepten los términos y condiciones
    if (!checkbox.classList.contains('checked')) {
        alert('Please accept the terms and conditions');
        return;
    }
    
    // Validar que las contraseñas coincidan
    const passwords = document.querySelectorAll('input[type="password"]');
    if (passwords[0].value !== passwords[1].value) {
        alert('Passwords do not match');
        return;
    }
    
    // Validar que todos los campos estén llenos
    const requiredFields = document.querySelectorAll('input[required]');
    let allFieldsFilled = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            allFieldsFilled = false;
        }
    });
    
    if (!allFieldsFilled) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Si todas las validaciones pasan
    alert('Account created successfully!');
    
    // Aquí podrías enviar los datos al servidor
    // fetch('/api/signup', { method: 'POST', body: formData })
});

// Funcionalidad adicional: efecto de focus mejorado
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});