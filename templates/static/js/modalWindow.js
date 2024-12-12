function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
}

function showSection(sectionId) {
    hideAllSections();
    const section = document.getElementById(sectionId);
    section.style.display = 'block';
}

function openModal(modalId) {
    const openModals = document.querySelectorAll('.modal[style*="display: flex"]');
    if (openModals.length > 0) {
        return;
    }
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
}

function updateNavMenu() {
    const token = localStorage.getItem('Token');
    const isModerator = localStorage.getItem('isModerator') === 'true';
    
    document.getElementById('loginButton').style.display = token ? 'none' : 'inline-block';
    document.getElementById('registerButton').style.display = token ? 'none' : 'inline-block';
    document.getElementById('logoutButton').style.display = token ? 'inline-block' : 'none';
    document.getElementById('createAdButton').style.display = token ? 'inline-block' : 'none';
    document.getElementById('profileButton').style.display = token ? 'inline-block' : 'none';
    document.getElementById('moderatorButton').style.display = isModerator ? 'inline-block' : 'none';
}

document.addEventListener('DOMContentLoaded', updateNavMenu);
