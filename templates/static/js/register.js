async function register(event) {
    event.preventDefault();
    
    const formData = {
        username: document.getElementById('registerUsername').value,
        password: document.getElementById('registerPassword').value,
        password2: document.getElementById('registerPassword2').value,
        email: document.getElementById('registerEmail').value,
        first_name: document.getElementById('registerFirstName').value,
        last_name: document.getElementById('registerLastName').value,
        profile: {
            phone_number: document.getElementById('registerPhoneNumber').value
        }
    };

    const response = await fetch(`${API_URL}/accounts/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        alert('Регистрация успешна!');
        login()
    } else {
        console.error('Ошибка при регистрации:', errorData);
    }
}
