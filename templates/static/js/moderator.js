async function loadModeratorAds() {
    const response = await fetch(`${API_URL}/webapp/moderator/`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('Token')}`
        }
    });
    const ads = await response.json();
    
    const container = document.getElementById('moderator-ads-container');
    container.innerHTML = '';

    ads.forEach(ad => {
        container.innerHTML += `
            <div class="ad">
                <img src="${ad.photo}" alt="Фото" style="width: 150px; height: 150px;">
                <h3>${ad.title}</h3>
                <p>${ad.description}</p>
                <p>Цена: ${ad.price}</p>
                <p>Статус: ${ad.status}</p>
                <p><em>${new Date(ad.created_at).toLocaleString()}</em></p>
                <button onclick="loadOneModeratorAd(${ad.id})">Подробнее</button>
                <button onclick="approveAd(${ad.id})">Одобрить</button>
                <button onclick="rejectAd(${ad.id})">Отклонить</button>
            </div>
        `;
    });
    showSection('moderatorSection');
}

async function loadOneModeratorAd(id) {
    const response = await fetch(`${API_URL}/webapp/moderator/${id}/`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('Token')}`
        }
    });
    const ad = await response.json();
    
    const moderatorAdDetail = document.getElementById('moderator-ad-details');
    moderatorAdDetail.innerHTML = `
        <img src="${ad.photo}" alt="Фото" style="width: 400px; height: 400px;">
        <h3>${ad.title}</h3>
        <p>${ad.description}</p>
        <p>Цена: ${ad.price}</p>
        <p>Категория: ${ad.category}</p>
        <p>Автор: <a href="#" onclick="loadProfile(${ad.author_id})">${ad.author}</a></p>
        <button onclick="approveAd(${ad.id})">Одобрить</button>
        <button onclick="rejectAd(${ad.id})">Отклонить</button>
    `;
    showSection('moderatorDetailSection');
}

async function approveAd(id) {
    await fetch(`${API_URL}/webapp/moderator/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('Token')}`
        },
        body: JSON.stringify({status: 'published'})
    });
    loadModeratorAds();
}

async function rejectAd(id) {
    await fetch(`${API_URL}/webapp/moderator/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('Token')}`
        },
        body: JSON.stringify({status: 'rejected'})
    });
    loadModeratorAds();
}
