const groceryItems = [
    { emoji: '🥛', name: 'Milk', daysLeft: 7 },
    { emoji: '🥕', name: 'Carrots', daysLeft: 3 },
    { emoji: '🍅', name: 'Tomatoes', daysLeft: 1 },
    { emoji: '🍗', name: 'Chicken', daysLeft: 0 }
];

const grid = document.getElementById('expiringGrid');
const themeBtn = document.getElementById('themeToggle');
const addBtn = document.querySelector('.add-button');
const body = document.body;

document.addEventListener('DOMContentLoaded', renderItems);

function renderItems() {
    grid.innerHTML = groceryItems.map((item, i) => createCard(item, i)).join('');
}

function createCard(item, i) {
    const width = Math.max(5, (item.daysLeft / 10) * 100);
    const type = item.daysLeft >= 7 ? 'green' : item.daysLeft >= 3 ? 'orange' : 'red';
    const daysClass = item.daysLeft >= 7 ? 'days-7' : item.daysLeft >= 3 ? 'days-3' : 'days-0';
    const text = item.daysLeft === 0 ? 'Expires today!' : `${item.daysLeft} days left`;
    
    return `
        <div class="item-card" style="animation-delay: ${i*.1}s">
            <span class="emoji">${item.emoji}</span>
            <div class="item-name">${item.name}</div>
            <div class="progress-container">
                <div class="progress-bar ${type}" style="width: ${width}%"></div>
            </div>
            <div class="days-left ${daysClass}">${text}</div>
        </div>
    `;
}

themeBtn.onclick = () => {
    const theme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
};

addBtn.onclick = () => {
    const name = prompt('🛒 Add item name:');
    if (name) {
        const days = parseInt(prompt('Days left:') || '5');
        groceryItems.unshift({ emoji: ['🍎','🍌','🥑','🥦','🍓'][Math.floor(Math.random()*5)], name, daysLeft: days });
        renderItems();
    }
};