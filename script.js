const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const gridContainer = document.getElementById('grid-container');
const checkButton = document.getElementById('check-button');
const startNextButton = document.getElementById('start-next-button');
const message = document.getElementById('message');
const scoreElement = document.getElementById('score');
const themeToggle = document.getElementById('theme-toggle');

let gridSize = 2;
const maxGridSize = 6;
let grid = [];
let level = 0;
let score = 0;

// Логика переключения темы
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        themeToggle.textContent = ' Светлая тема';
        icon.className = 'fas fa-sun';
    } else {
        themeToggle.textContent = ' Тёмная тема';
        icon.className = 'fas fa-moon';
    }
});

// Функция начисления очков
function calculateScore() {
    score += Math.pow(2, level) * 10;
    scoreElement.textContent = `Очки: ${score}`;
}

// Функция генерации случайных подсказок с проверкой уникальности цветов
function generatePrefilledCells(gridSize) {
    const numPrefilled = Math.floor(gridSize / 2);
    let prefilledCells = [];

    const rowSets = Array.from({ length: gridSize }, () => new Set());
    const colSets = Array.from({ length: gridSize }, () => new Set());

    while (prefilledCells.length < numPrefilled) {
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);
        let color = colors[Math.floor(Math.random() * gridSize)];

        if (!prefilledCells.some(cell => cell.row === row && cell.col === col) &&
            !rowSets[row].has(color) && !colSets[col].has(color)) {

            prefilledCells.push({ row, col, color });
            rowSets[row].add(color);
            colSets[col].add(color);
        }
    }

    return prefilledCells;
}

// Генерация сетки
function generateGrid() {
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;

    const prefilledCells = generatePrefilledCells(gridSize);

    grid = [];
    for (let row = 0; row < gridSize; row++) {
        grid[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            grid[row][col] = cell;

            const prefilledCell = prefilledCells.find(c => c.row === row && c.col === col);
            if (prefilledCell) {
                cell.style.backgroundColor = prefilledCell.color;
                cell.classList.add('locked');
            } else {
                cell.addEventListener('click', () => {
                    const currentColor = cell.style.backgroundColor;
                    const newColor = colors[(colors.indexOf(currentColor) + 1) % gridSize];
                    cell.style.backgroundColor = newColor;
                });
            }

            gridContainer.appendChild(cell);
        }
    }
}

// Проверка правильности
checkButton.addEventListener('click', () => {
    if (checkGrid()) {
        message.textContent = 'Поздравляем! Все цвета расставлены правильно!';
        message.style.color = 'green';
        checkButton.disabled = true;
        startNextButton.textContent = 'Следующий уровень';
        startNextButton.disabled = false;
        calculateScore();
        level++;
    } else {
        message.textContent = 'Ошибка! Попробуйте снова.';
        message.style.color = 'red';
    }
});

// Функция проверки уникальности цветов
function checkGrid() {
    for (let i = 0; i < gridSize; i++) {
        let rowColors = new Set();
        let colColors = new Set();
        for (let j = 0; j < gridSize; j++) {
            let rowColor = grid[i][j].style.backgroundColor;
            let colColor = grid[j][i].style.backgroundColor;

            if (!rowColor || rowColors.has(rowColor)) {
                return false;
            }
            rowColors.add(rowColor);

            if (!colColor || colColors.has(colColor)) {
                return false;
            }
            colColors.add(colColor);
        }
    }
    return true;
}

// Старт игры или следующий уровень
startNextButton.addEventListener('click', () => {
    if (startNextButton.textContent === 'Начать игру') {
        gridSize = 2;
        level = 0;
        score = 0;
        scoreElement.textContent = `Очки: ${score}`;
    } else if (gridSize < maxGridSize) {
        gridSize++;
    }

    generateGrid();
    checkButton.disabled = false;
    message.textContent = '';
    startNextButton.disabled = true;
});

startNextButton.textContent = 'Начать игру';
