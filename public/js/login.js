
const loginForm = document.getElementById('loginForm');



loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let email = document.getElementById('email').value
    let password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Esto asegura que las cookies sean enviadas
        body: JSON.stringify({ email, password }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al iniciar sesión');
            }
            return response.json();
        })
        .then(data => {
            console.log('Inicio de sesión exitoso:', data.message);
            alert('Inicio de sesión exitoso');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al iniciar sesión');
        });

})
