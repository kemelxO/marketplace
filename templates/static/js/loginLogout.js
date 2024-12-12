async function login(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${API_URL}/accounts/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const result = await response.json();
    if (result.token) {
        localStorage.setItem('Token', result.token);
        const profileResponse = await fetch(`${API_URL}/accounts/profile/`, {
            headers: {
                'Authorization': `Token ${result.token}`
            }
        });
        if (profileResponse.ok) {
            const profiles = await profileResponse.json();
            const userProfile = profiles.find(profile => profile.user.username === username);
            console.log(userProfile)

            if (userProfile) {
                localStorage.setItem('UserId', userProfile.id);
                localStorage.setItem('isModerator', userProfile.user.is_staff);
                closeModal('loginModal');
                updateNavMenu();
                window.location.reload();
            } else {
                alert('Профиль пользователя не найден.');
            }
        } else {
            alert('Ошибка при загрузке профиля.');
        }
    } else {
        alert('Login failed');
    }
}

function logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('UserId');
    localStorage.removeItem('isModerator');
    updateNavMenu();
    window.location.reload();
}
