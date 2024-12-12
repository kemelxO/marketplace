const API_URL = 'http://127.0.0.1:8000';


async function loadCategories() {
    const response = await fetch(`${API_URL}/webapp/categories/`);
    const categories = await response.json();
    
    CategoryOptions(categories, 'category-filter');
    CategoryOptions(categories, 'category-select');
    CategoryOptions(categories, 'category-select-edit');
}

function CategoryOptions(categories, selectElementId) {
    const selectElement = document.getElementById(selectElementId);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        selectElement.appendChild(option);
    });
}

async function loadAds(category = null) {
    let url = `${API_URL}/webapp/ads/`;
    if (category) {
        url += `?category=${category}`;
    }
    const response = await fetch(url);
    const ads = await response.json();
    
    const publishedAds = ads.filter(ad => ad.status === 'published');
    const adsContainer = document.getElementById('ads-container');
    adsContainer.innerHTML = '';

    publishedAds.forEach(ad => {
        adsContainer.innerHTML += `
            <div class="ads-container">
                <img src="${ad.photo}" alt="img" style="width: 150px; height: 150px;>
                <div class="ad-card-content">
                    <h3>${ad.title}</h3>
                    <p>Цена: ${ad.price} kzt.</p>
                    <p>Категория: ${ad.category}</p>
                    <p>Статус: ${ad.status}</p>
                    <p><em>${ad.published_at ? new Date(ad.published_at).toLocaleDateString() : 'Не опубликовано'}</em></p>
                    <button onclick="loadOneAd(${ad.id})">Подробнее</button>
                </div>
            </div>
        `;
    });
    showSection('adsSection')
}

async function loadOneAd(id) {
    const userId = localStorage.getItem('UserId');
    const response = await fetch(`${API_URL}/webapp/ads/${id}/`);
    const ad = await response.json();
    
    const adDetails = document.getElementById('ad-details');
    adDetails.innerHTML = `
        <h3>${ad.title}</h3>
        <img src="${ad.photo}" alt="Фото" style="width: 400px; height: 400px;">
        <p>Описание:${ad.description}</p>
        <p>Цена: ${ad.price}</p>
        <p>Категория: ${ad.category}</p>
        <p>Автор: <a href="#" onclick="loadProfile(${ad.author_id})">${ad.author}</a></p>
    `;
    if (String(ad.author_id) === String(userId)) {
        adDetails.innerHTML += `
            <button onclick="loadAdForEdit(${ad.id})" id="editButton">Редактировать</button>
            <button onclick="deleteAd(${ad.id})" id="deleteButton">Удалить</button>
        `;
    }
    showSection('adDetailSection');
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadAds();
});

document.getElementById('category-filter').addEventListener('change', (e) => {
    loadAds(e.target.value);
});
