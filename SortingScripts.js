// scripts.js

// DOM elements
const newArrayBtn = document.querySelector("#newArray");
const bubbleSortBtn = document.querySelector("#bubbleSort");
const mergeSortBtn = document.querySelector("#mergeSort");
const quickSortBtn = document.querySelector("#quickSort");
const insertionSortBtn = document.querySelector("#insertionSort");
const selectionSortBtn = document.querySelector("#selectionSort");
const arraySizeSlider = document.querySelector("#arraySize");
const speedSlider = document.querySelector("#speed");
const darkModeToggle = document.querySelector("#darkMode");
const barsContainer = document.querySelector("#barsContainer");

let array = [];
let delay = 1000 / speedSlider.value; // Initial delay for sorting speed

// Event listeners
newArrayBtn.addEventListener('click', generateNewArray);
arraySizeSlider.addEventListener('input', generateNewArray);
 
speedSlider.addEventListener('input', () => {// when an input is given in slider delay variable updates with expression involveing input value
    delay = 1000 / speedSlider.value;
});

darkModeToggle.addEventListener('click', toggleDarkMode);

// wraper function used to prevent the immediate execution of the function when argument is provided or () is used
bubbleSortBtn.addEventListener('click', () => bubbleSort(array));
mergeSortBtn.addEventListener('click', () => mergeSort(array));
quickSortBtn.addEventListener('click', () => quickSort(array));
insertionSortBtn.addEventListener('click', () => insertionSort(array));
selectionSortBtn.addEventListener('click', () => selectionSort(array));

// Generate a new array
function generateNewArray() {
    array = [];
    for (let i = 0; i < arraySizeSlider.value; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    renderBars(array);
}

// Render bars on the screen
function renderBars(array) {
    barsContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 4}px`; // Scale the height for better visibility
        bar.style.width = '8px'; // Example width (adjust as needed)
        barsContainer.appendChild(bar);
    });
}


// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    document.querySelector('header').classList.toggle('dark');
    document.querySelector('footer').classList.toggle('dark');
    document.querySelector('nav').classList.toggle('dark');
    barsContainer.classList.toggle('dark');

    const icon = darkModeToggle.querySelector('i');
    if (document.body.classList.contains('dark')){
        icon.classList.replace('fa-moon', 'fa-sun');
    }else{
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

// Swap two bars in the DOM
function swap(b1, b2) {
    const temp = b1.style.height;
    b1.style.height = b2.style.height;
    b2.style.height = temp;
}

// Bubble Sort
async function bubbleSort(array) {
    disableControls();
    const bars = document.querySelectorAll('.bar');

    for(let x = 0; x < array.length; x++){
        bars[x].style.backgroundColor = '';
    }
    
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {

            bars[j].style.backgroundColor = 'red';
            bars[j + 1].style.backgroundColor = 'red';

            if (array[j] > array[j + 1]) {
                await new Promise((resolve , reject) => setTimeout(resolve, delay)); // a new promise is created and awaited for the time delay , hence to control the speed

                swap(bars[j], bars[j + 1]);

                let temp1 = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp1;
            }

            bars[j].style.backgroundColor = '';
            bars[j + 1].style.backgroundColor = '';
        }

        bars[array.length - i - 1].style.backgroundColor = 'green';
    }
    bars[0].style.backgroundColor = 'green';
    enableControls();
}

// Merge Sort
async function mergeSort(array) {
    disableControls(); // Disable UI controls during sorting
    await mergeSortHelper(array, 0, array.length - 1);
    enableControls(); // Enable UI controls after sorting is complete
}

// Helper function for Merge Sort
async function mergeSortHelper(array, left, right) {
    if (left >= right) {
        return;
    }
    const mid = Math.floor((left + right) / 2);
    await mergeSortHelper(array, left, mid);
    await mergeSortHelper(array, mid + 1, right);
    await merge(array, left, mid, right);
}

// Merge function to merge two sorted halves of array
async function merge(array, left, mid, right) {
    const bars = document.querySelectorAll('.bar');
    if (!bars || bars.length === 0) {
        console.error("Bars array is empty or undefined");
        return;
    }

    let i = left, j = mid + 1;
    const tempArray = [];

    while (i <= mid && j <= right) {
        if (i < bars.length) bars[i].style.backgroundColor = 'ed'; // Highlight current elements being compared
        if (j < bars.length) bars[j].style.backgroundColor = 'ed';
        await new Promise(resolve => setTimeout(resolve, delay));

        if (array[i] <= array[j]) {
            tempArray.push(array[i]);
            i++; // increment i after accessing bars[i]
        } else {
            tempArray.push(array[j]);
            j++; // increment j after accessing bars[j]
        }
        // Reset background color after comparison
        if (i - 1 >= 0 && i - 1 < bars.length) bars[i - 1].style.backgroundColor = '';
        if (j - 1 >= 0 && j - 1 < bars.length) bars[j - 1].style.backgroundColor = '';
    }

    // Push remaining elements from the left half
    while (i <= mid) {
        if (i < bars.length) bars[i].style.backgroundColor = 'ed';
        await new Promise(resolve => setTimeout(resolve, delay));
        tempArray.push(array[i]);
        i++; // increment i after accessing bars[i]
        if (i - 1 >= 0 && i - 1 < bars.length) bars[i - 1].style.backgroundColor = '';
    }

    // Push remaining elements from the right half
    while (j <= right) {
        if (j < bars.length) bars[j].style.backgroundColor = 'ed';
        await new Promise(resolve => setTimeout(resolve, delay));
        tempArray.push(array[j]);
        j++; // increment j after accessing bars[j]
        if (j - 1 >= 0 && j - 1 < bars.length) bars[j - 1].style.backgroundColor = '';
    }

    // Copy elements from tempArray back to original array and update visual bars
    for (let k = left; k <= right; k++) {
        array[k] = tempArray[k - left];
        if (k < bars.length) {
            bars[k].style.height = `${array[k] * 4}px`; // Update bar height to reflect new value
            bars[k].style.backgroundColor = 'green'; // Mark sorted bars with green color
        }
    }
}

// Quick Sort
async function quickSort(array) {
    disableControls();
    await quickSortHelper(array, 0, array.length - 1);
    enableControls();
}

async function quickSortHelper(array, low, high) {
    if (low < high) {
        const pi = await partition(array, low, high);
        await quickSortHelper(array, low, pi - 1);
        await quickSortHelper(array, pi + 1, high);
    }
}

async function partition(array, low, high) {
    const pivot = array[high];
    const bars = document.querySelectorAll('.bar');
    bars[high].style.backgroundColor = 'red';
    let i = low - 1;
    for (let j = low; j < high; j++) {
        bars[j].style.backgroundColor = 'red';
        await new Promise(resolve => setTimeout(resolve, delay));
        if (array[j] < pivot) {
            i++;
            swap(bars[i], bars[j]);
            [array[i], array[j]] = [array[j], array[i]];
        }
        bars[j].style.backgroundColor = '';
    }
    swap(bars[i + 1], bars[high]);
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[high].style.backgroundColor = '';
    for (let k = 0; k <= high; k++) {
        bars[k].style.backgroundColor = 'green';
    }
    return i + 1;
}

// Insertion Sort
async function insertionSort(array) {
    disableControls();
    const bars = document.querySelectorAll('.bar');

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = 'red';
        while (j >= 0 && array[j] > key) {
            bars[j].style.backgroundColor = 'red';
            await new Promise(resolve => setTimeout(resolve, delay));
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j] * 4}px`;
            bars[j].style.backgroundColor = '';
            j--;
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key * 4}px`;
        bars[i].style.backgroundColor = '';
    }
    for (let k = 0; k < array.length; k++) {
        bars[k].style.backgroundColor = 'green';
    }
    enableControls();
}

// Selection Sort
async function selectionSort(array) {

    disableControls();
    const bars = document.querySelectorAll('.bar');

    for (let i = 0; i < array.length; i++) {
        
        let minIndex = i;
        bars[minIndex].style.backgroundColor = 'red';

        for (let j = i + 1; j < array.length; j++) {
            bars[j].style.backgroundColor = 'red';

            await new Promise((resolve , reject) => setTimeout(resolve, delay));


            if (array[j] < array[minIndex]) {
                bars[minIndex].style.backgroundColor = '';
                minIndex = j;
                bars[minIndex].style.backgroundColor = 'red';
            } else {
                bars[j].style.backgroundColor = '';
            }
        }
        swap(bars[i], bars[minIndex]);

        let temp2 = array[i];
        array[i] = array[minIndex];
        array[minIndex] = temp2;

        bars[minIndex].style.backgroundColor = '';
        bars[i].style.backgroundColor = 'green';
    }
    enableControls();
}

// Disable control buttons and sliders
function disableControls() {
    newArrayBtn.disabled = true;
    bubbleSortBtn.disabled = true;
    mergeSortBtn.disabled = true;
    quickSortBtn.disabled = true;
    insertionSortBtn.disabled = true;
    selectionSortBtn.disabled = true;
    arraySizeSlider.disabled = true;
    speedSlider.disabled = true;
}

// Enable control buttons and sliders
function enableControls() {
    newArrayBtn.disabled = false;
    bubbleSortBtn.disabled = false;
    mergeSortBtn.disabled = false;
    quickSortBtn.disabled = false;
    insertionSortBtn.disabled = false;
    selectionSortBtn.disabled = false;
    arraySizeSlider.disabled = false;
    speedSlider.disabled = false;
}
