async function loadAdForEdit(id) {
    const response = await fetch(`${API_URL}/webapp/ads/${id}/`);
    const ad = await response.json();

    if (ad.status === 'rejected') {
        alert('Отклоненные объявления невозможно редактировать.');
        loadCheckProfile();
        return;
    }

    localStorage.setItem('EditFormId', id);

    document.querySelector('input[name="title"]').value = ad.title;
    document.querySelector('textarea[name="description"]').value = ad.description;
    document.querySelector('input[name="price"]').value = ad.price;
    document.querySelector('select[name="category_id"]').value = ad.category;

    showSection('editAdSection');
}

async function editAd(event) {
    event.preventDefault();
    const id = localStorage.getItem('EditFormId');
    const formData = new FormData(document.getElementById('edit-ad-form'));

    const fields = [
        { name: 'title', selector: 'input[name="title"]' },
        { name: 'description', selector: 'textarea[name="description"]' },
        { name: 'price', selector: 'input[name="price"]' },
        { name: 'category_id', selector: 'select[name="category_id"]' },
    ];

    fields.forEach(field => {
        const input = document.querySelector(field.selector);
        if (field.isFile) {
            if (input.files.length === 0) {
                formData.delete(field.name);
            }
        } else {
            if (input.value.trim() === '') {
                formData.delete(field.name);
            }
        }
    });

    const response = await fetch(`${API_URL}/webapp/ads/${id}/`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Token ${localStorage.getItem('Token')}`
        },
        body: formData
    });

    if (response.ok) {
        alert('Объявление обновлено!');
        localStorage.removeItem('EditFormId');
        loadOneAd(id);
    } else {
        alert('Ошибка при обновлении объявления.');
    }
    showSection('adsSection')
}

async function deleteAd(id) {
    const response = await fetch(`${API_URL}/webapp/ads/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${localStorage.getItem('Token')}`
        }
    });

    if (response.ok) {
        alert('Объявление удалено!');
        loadCheckProfile()
    } else {
        alert('Ошибка при удалении объявления.');
    }
}
