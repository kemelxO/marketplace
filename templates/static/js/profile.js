const userId = localStorage.getItem('UserId');


async function loadCheckProfile() {
    if (!userId) {
        alert("Пожалуйста, войдите в систему, чтобы просмотреть свой профиль.");
        return;
    } else {
        loadMyProfile(userId)
    }
}

async function loadMyProfile(id) {
    const response = await fetch(`${API_URL}/accounts/profile/${id}/`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('Token')}`
        }
    });
    const data = await response.json();
    const profile = data.profile
    document.getElementById('user-profile').innerHTML = `
        <h3>${profile.user.first_name} ${profile.user.last_name}</h3>
        <p>Email: ${profile.user.email}</p>
        <p>Телефон: ${profile.phone_number}</p>
        <button onclick="openModal('profileEditModal')">Редактировать</button>
    `;
    const ads = data.ads.sort((a, b) => new Date(b.id) - new Date(a.id));
    let adsProfile = '';
    ads.forEach(ad => {
        const photoUrl = ad.photo.startsWith('http') ? ad.photo : `${API_URL}${ad.photo}`;
        adsProfile += `
            <h3>${ad.title}</h3>
            <img src="${photoUrl}" alt="Фото" style="width: 200px; height: 200px;">
            <p>${ad.description}</p>
            <p>Цена: ${ad.price}</p>
            <p>Категория: ${ad.category}</p>
            <p>Создано: <em>${new Date(ad.created_at).toLocaleString()}</em></p>
            <p>Обновлено: <em>${new Date(ad.updated_at).toLocaleString()}</em></p>
            <p>Опубликовано: <em>${ad.published_at ? new Date(ad.published_at).toLocaleString() : 'Не опубликовано'}</em></p>
            <p>Статус: ${ad.status}</p>
            <button onclick="loadAdForEdit(${ad.id})">Редактировать</button>
            <button onclick="deleteAd(${ad.id})">Удалить</button>
            <hr>
        `;
    });
    document.getElementById('user-ads').innerHTML = adsProfile;
    showSection('profileSection');
}

async function loadProfile(id) {
    const response = await fetch(`${API_URL}/accounts/profile/${id}/`);
    const data = await response.json();

    const profile = data.profile
    document.getElementById('user-profile').innerHTML = `
        <h3>${profile.user.first_name} ${profile.user.last_name}</h3>
        <p>Email: ${profile.user.email}</p>
        <p>Телефон: ${profile.phone_number}</p>
    `;
    const ads = data.ads.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    let adsProfile = '';
    ads.forEach(ad => {
        const photoUrl = ad.photo.startsWith('http') ? ad.photo : `${API_URL}${ad.photo}`;
        adsProfile += `
            <h3>${ad.title}</h3>
            <img src="${photoUrl}" alt="Фото" style="width: 200px; height: 200px;">
            <p>${ad.description}</p>
            <p>Цена: ${ad.price}</p>
            <p>Категория: ${ad.category}</p>
            <p>Создано: <em>${new Date(ad.created_at).toLocaleString()}</em></p>
            <p>Обновлено: <em>${new Date(ad.updated_at).toLocaleString()}</em></p>
            <p>Опубликовано: <em>${ad.published_at ? new Date(ad.published_at).toLocaleString() : 'Не опубликовано'}</em></p>
            <hr>
        `;
    });
    document.getElementById('user-ads').innerHTML = adsProfile;
    showSection('profileSection');
}

async function editProfileform(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('edit-profile-form'));

    const fields = [
        { name: 'user.first_name', selector: 'input[name="user.first_name"]' },
        { name: 'user.last_name', selector: 'input[name="user.last_name"]' },
        { name: 'user.email', selector: 'input[name="user.email"]' },
        { name: 'phone_number', selector: 'input[name="phone_number"]' }
    ];
    fields.forEach(field => {
        const input = document.querySelector(field.selector);
        if (input.value.trim() === '') {
            formData.delete(field.name);
        }
    });
    
    const response = await fetch(`${API_URL}/accounts/profile/${userId}/`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Token ${localStorage.getItem('Token')}`
        },
        body: formData
    });

    if (response.ok) {
        alert('Объявление обновлено!');
        closeModal('profileEditModal');
        loadCheckProfile();
    } else {
        alert('Ошибка при обновлении объявления.');
    }
}
