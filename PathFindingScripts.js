const gridElement = document.getElementById('grid');
let grid = [];
const rows = 20;
const cols = 40;
let startNode = null;
let endNode = null;
let activeButton = null;
let animating = false;



function createGrid() {
    gridElement.innerHTML = '';
    grid = [];
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gridElement.appendChild(cell);
            grid[row][col] = cell;
        }
    }
}

function handleCellClick(event) {
    if (animating) return;

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    if (activeButton === 'start') {
        if (startNode) startNode.classList.remove('start');
        startNode = cell;
        cell.classList.add('start');
    } else if (activeButton === 'end') {
        if (endNode) endNode.classList.remove('end');
        endNode = cell;
        cell.classList.add('end');
    } else if (activeButton === 'obstacle') {
        cell.classList.toggle('obstacle');
    }
}
// darkMode toggle
function toggleDarkMode(){
    alert("Dark mode is under maintainance");
}

document.getElementById('darkMode').addEventListener('click' , toggleDarkMode)


document.getElementById('startButton').addEventListener('click', function() {
    setActiveButton('start');
});

document.getElementById('endButton').addEventListener('click', function() {
    setActiveButton('end');
});

document.getElementById('obstacleButton').addEventListener('click', function() {
    setActiveButton('obstacle');
});

document.getElementById('findPathButton').addEventListener('click', findPath);
document.getElementById('resetButton').addEventListener('click', resetGrid);

function setActiveButton(button) {
    activeButton = button;
    document.querySelectorAll('.controls button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(button + 'Button').classList.add('active');
}

function resetGrid() {
    if (animating) return;
    createGrid();
    startNode = null;
    endNode = null;
    document.getElementById('result').innerText = '';
    activeButton = null;
}

function findPath() {
    if (animating) return;
    if (!startNode || !endNode) {
        alert("Please set both start and end nodes.");
        return;
    }
    const start = [parseInt(startNode.dataset.row), parseInt(startNode.dataset.col)];
    const end = [parseInt(endNode.dataset.row), parseInt(endNode.dataset.col)];
    const path = dijkstra(grid, start, end);
    if (path) {
        animating = true;
        animateTraversal(path.traversal, () => animatePath(path.path, () => {
            animating = false;
            document.getElementById('result').innerText = 'Path found!';
        }));
    } else {
        document.getElementById('result').innerText = 'No path found!';
    }
}

function dijkstra(grid, start, end) {
    const distances = new Map();
    const previous = new Map();
    const queue = new PriorityQueue();
    const traversal = [];

    grid.forEach((row, i) => row.forEach((cell, j) => {
        distances.set(cell, Infinity);
        queue.enqueue([i, j], Infinity);
    }));
    distances.set(grid[start[0]][start[1]], 0);
    queue.enqueue(start, 0);

    while (!queue.isEmpty()) {
        const [row, col] = queue.dequeue().element;
        const currentNode = grid[row][col];
        traversal.push(currentNode);

        if (row === end[0] && col === end[1]) {
            const path = [];
            let u = currentNode;
            while (u) {
                path.unshift(u);
                u = previous.get(u);
            }
            return { traversal, path };
        }

        getNeighbors(grid, row, col).forEach(neighbor => {
            if (neighbor.classList.contains('obstacle')) return;

            const alt = distances.get(currentNode) + 1;
            if (alt < distances.get(neighbor)) {
                distances.set(neighbor, alt);
                previous.set(neighbor, currentNode);
                queue.enqueue([parseInt(neighbor.dataset.row), parseInt(neighbor.dataset.col)], alt);
            }
        });
    }
    return null;
}

function getNeighbors(grid, row, col) {
    const neighbors = [];
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < rows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < cols - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
}

function animateTraversal(traversal, callback) {
    let index = 0;

    function animate() {
        if (index < traversal.length) {
            const cell = traversal[index];
            if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
                cell.classList.add('visited');
            }
            index++;
            requestAnimationFrame(animate);
        } else {
            callback();
        }
    }
    animate();
}

function animatePath(path, callback) {
    let index = 0;

    function animate() {
        if (index < path.length) {
            const cell = path[index];
            cell.classList.add('path');
            index++;
            requestAnimationFrame(animate);
        } else {
            callback();
        }
    }
    animate();
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

// Initialize grid
createGrid();
