async function createAdsForm() {
    event.preventDefault();
    const form = document.getElementById('create-ad-form');
    const formData = new FormData(form);
    
    const response = await fetch(`${API_URL}/webapp/ads/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${localStorage.getItem('Token')}`
        },
        body: formData
    });

    if (response.ok) {
        alert('Объявление создано!');
        closeModal('createAdsFormContent');
        loadAds();
    } else {
        alert('Ошибка при создании объявления.');
    }
    showSection('createAdsFormContent');
}

document.getElementById('create-ad-form').addEventListener('submit', function (e) {
    e.preventDefault();
    createAdsForm();
});

