export const state = {
    isDragging: false
}
let dragElement = null;
let dropTargetElement = null;
let nexts;

let mx = 0;
let my = 0;
let bx = 0;
let by = 0;

let rem = 10;
let wx = 0;
let wy = 0;

let duplicateTarget = null;

// DOM 불러오기
const html = document.documentElement;
const htmlStyle = window.getComputedStyle(html);
rem = htmlStyle.fontSize;

const workspace = document.getElementById('workspace');
let workspaceRect = workspace.getBoundingClientRect();
wx = workspaceRect.left;
wy = workspaceRect.top;

const observer = new ResizeObserver((entries) => {
    workspaceRect = workspace.getBoundingClientRect();
    wx = workspaceRect.left;
    wy = workspaceRect.top;
    rem = parseFloat(htmlStyle.fontSize);
})
observer.observe(document.body);

const menu = document.getElementById('contextmenu');
const mbtn1 = document.getElementById('menuBtn1');
const mbtn2 = document.getElementById('menuBtn2');

const bucket = document.getElementById('bucket');

// 블록 드래그 처리
export function grabBlock(element, e, isFirst, elementId) {
    if (state.isDragging) return;
    if (e.button !== 0) return;
    removeMenu();

    state.isDragging = true;
    dragElement = element;

    document.body.style.cursor = 'grabbing';

    nexts = dragElement.querySelectorAll('.next-block');
    nexts.forEach((el) => el.classList.add('no-in'));
    
    let rect;
    if (isFirst) {
        const originElement = document.querySelector(`.origin_${elementId}`);
        rect = originElement.getBoundingClientRect();
    } else {
        rect = dragElement.getBoundingClientRect();
    }
    mx = e.clientX;
    my = e.clientY;
    bx = rect.left;
    by = rect.top;
    dragElement.style.left = `${bx}px`;
    dragElement.style.top = `${by}px`;
    dragElement.style.transform = `translate(${-wx}px, ${-wy}px) scale(1.1)`;
    
    workspace.appendChild(dragElement);
    
    dragElement.classList.add('dragging');
    dragElement.classList.remove('joined');
    document.addEventListener('mousemove', moveBlock);
    document.addEventListener('mouseup', dropBlock);
    
    displayBucket(true);
}

function moveBlock(e) {
    if (!state.isDragging || !dragElement) return;
    const px = e.clientX;
    const py = e.clientY;
    dragElement.style.transform = `translate(${px- mx - wx}px, ${py - my - wy}px) scale(1.1)`;

    // dropTargetElemnt
    const pointerEls = document.elementsFromPoint(px, py);
    dropTargetElement = pointerEls.find((el) => el.classList.contains('next-block') && !el.classList.contains('no-in')) ?? null;
    document.querySelectorAll('.imsi').forEach((el) => el.remove());
    if (!dropTargetElement) return;

    // 임시 블록
    const rect = dragElement.getBoundingClientRect();
    const imsi = document.createElement('div');
    imsi.classList.add('imsi');
    imsi.style.width = `${rect.width}px`;
    imsi.style.height = `${rect.height - rem}px`;
    dropTargetElement.prepend(imsi);
}

function dropBlock(e) {
    if (!state.isDragging || !dragElement) return;
    state.isDragging = false;
    dragElement.style.transform = '';
    document.body.style.cursor = 'default';
    
    const bucketRect = bucket.getBoundingClientRect();
    const px = e.clientX;
    const py = e.clientY;

    if (bucketRect.left < px && bucketRect.right > px && bucketRect.top < py && bucketRect.bottom > py) {
        dragElement.remove();
    } else {
        if (dropTargetElement) {
            const wrapper = dropTargetElement.querySelector(':scope > .block-wrapper');
            if (wrapper) {
                const box = dragElement.querySelectorAll('.next-block');
                const targetBox = box[box.length - 1];
                targetBox.appendChild(wrapper);
            }
            dropTargetElement.appendChild(dragElement);
            dragElement.classList.add('joined');
            document.querySelectorAll('.imsi').forEach((el) => el.remove());
            dragElement.style.left = '0px';
            dragElement.style.top = '0px';
        } else {
            dragElement.style.left = `${bx - wx + px - mx}px`;
            dragElement.style.top = `${by - wy + py - my}px`;   
        }
        dragElement.classList.remove('dragging');
    }

    
    nexts.forEach((el) => el.classList.remove('no-in'));
    dropTargetElement = null;
    dragElement = null;
    nexts = null;
    document.removeEventListener('mousemove', moveBlock);
    document.removeEventListener('mouseup', dropBlock);
    displayBucket(false);
}


// 값 드래그 처리
export function grabValue(element, e, isFirst, elementId) {
    if (state.isDragging) return;
    if (e.button !== 0) return;
    removeMenu();

    state.isDragging = true;
    dragElement = element;

    document.body.style.cursor = 'grabbing';

    let rect;
    if (isFirst) {
        const originElement = document.querySelector(`.origin_${elementId}`);
        rect = originElement.getBoundingClientRect();
    } else {
        rect = dragElement.getBoundingClientRect();
    }
    mx = e.clientX;
    my = e.clientY;
    bx = rect.left;
    by = rect.top;
    dragElement.style.left = `${bx}px`;
    dragElement.style.top = `${by}px`;
    dragElement.style.transform = `translate(${-wx}px, ${-wy}px) scale(1.1)`;
    
    nexts = dragElement.querySelectorAll('.ph');
    nexts.forEach((el) => el.classList.add('no-in'));

    workspace.appendChild(dragElement);
    
    dragElement.classList.add('dragging');
    dragElement.classList.remove('joined');
    document.addEventListener('mousemove', moveValue);
    document.addEventListener('mouseup', dropValue);
    
    displayBucket(true);
}

function moveValue(e) {
    if (!state.isDragging || !dragElement) return;
    const px = e.clientX;
    const py = e.clientY;
    dragElement.style.transform = `translate(${px- mx - wx}px, ${py - my - wy}px) scale(1.1)`;

    // dropTargetElemnt
    const pointerEls = document.elementsFromPoint(px, py);
    document.querySelectorAll('.target-ph').forEach((el) => el.classList.remove('target-ph'));
    dropTargetElement = pointerEls.find((el) => el.classList.contains('ph') && !el.classList.contains('no-in')) ?? null;
    if (!dropTargetElement) return;
    dropTargetElement.classList.add('target-ph');
}

function dropValue(e) {
    if (!state.isDragging || !dragElement) return;
    state.isDragging = false;
    dragElement.style.transform = '';
    document.body.style.cursor = 'default';
    
    const bucketRect = bucket.getBoundingClientRect();
    const px = e.clientX;
    const py = e.clientY;

    if (bucketRect.left < px && bucketRect.right > px && bucketRect.top < py && bucketRect.bottom > py) {
        dragElement.remove();
    } else {
        if (dropTargetElement) {
            dropTargetElement.textContent = '';
            dropTargetElement.appendChild(dragElement);
            dragElement.classList.add('joined');
            dragElement.style.left = '0px';
            dragElement.style.top = '0px';
        } else {
            dragElement.style.left = `${bx - wx + px - mx}px`;
            dragElement.style.top = `${by - wy + py - my}px`;   
        }
        dragElement.classList.remove('dragging');
    }

    
    nexts.forEach((el) => el.classList.remove('no-in'));
    dropTargetElement = null;
    dragElement = null;
    nexts = null;
    document.removeEventListener('mousemove', moveValue);
    document.removeEventListener('mouseup', dropValue);
    displayBucket(false);
}




// context menu 관련
export function displayMenu(e, target) {
    e.preventDefault();
    duplicateTarget = target;
    const px = e.clientX;
    const py = e.clientY;
    menu.style.left = `${px}px`;
    menu.style.top = `${py}px`;
    menu.style.display = 'flex';
    mbtn1.addEventListener('click', duplicateOne, true);
    mbtn2.addEventListener('click', duplicateAll, true);
}

function duplicateOne(e) {
    const dup = duplicateTarget.cloneNode(true);
    const next = dup.querySelector(':scope > .next-block');
    next.innerHTML = '';
    dup.classList.remove('joined');
    dup.style.left = `${e.clientX - wx}px`;
    dup.style.top = `${e.clientY - wy}px`;
    dup.style.position = 'absolute';
    const block = dup.querySelector(':scope > .block');
    
    dup.querySelectorAll('.value').forEach((v) => {
        v.addEventListener('mousedown', (dragEvent) => {
            if (document.elementFromPoint(dragEvent.clientX, dragEvent.clientY).classList.contains('ph')) return;
            grabValue(v, dragEvent, false, '');
        })
    })

    block.addEventListener('mousedown', (dragEvent) => {
        if (document.elementFromPoint(dragEvent.clientX, dragEvent.clientY).classList.contains('ph')) return;
        grabBlock(dup, dragEvent, false, '');
    })
    block.addEventListener('contextmenu', (e) => {
        displayMenu(e, dup);
    });
    workspace.appendChild(dup);
    duplicateTarget = null;
}

function duplicateAll(e) {
    const dup = duplicateTarget.cloneNode(true);
    dup.classList.remove('joined');
    dup.style.left = `${e.clientX - wx}px`;
    dup.style.top = `${e.clientY - wy}px`;
    dup.style.position = 'absolute';
    const blocks = dup.querySelectorAll('.block');

    dup.querySelectorAll('.value').forEach((v) => {
        v.addEventListener('mousedown', (dragEvent) => {
            if (document.elementFromPoint(dragEvent.clientX, dragEvent.clientY).classList.contains('ph')) return;
            grabValue(v, dragEvent, false, '');
        })
    })

    blocks.forEach((block) => {
        const wrapper = block.closest('.block-wrapper');

        block.addEventListener('mousedown', (dragEvent) => {
            if (document.elementFromPoint(dragEvent.clientX, dragEvent.clientY).classList.contains('ph')) return;
            grabBlock(wrapper, dragEvent, false, '');
        })
        
        block.addEventListener('contextmenu', (e) => {
            displayMenu(e, wrapper);
        })
    })
    
    workspace.appendChild(dup);
    duplicateTarget = null;
}

function removeMenu() {
    menu.style.display = 'none';
    mbtn1.removeEventListener('click', duplicateOne);
    mbtn2.removeEventListener('click', duplicateAll);
    duplicateTarget = null;
}

document.addEventListener('click', removeMenu);

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})


// bucket 관련
function displayBucket(isDisplaying) {
    if (isDisplaying) {
        bucket.style.display = 'flex';
    } else {
        bucket.style.display = 'none';
    }
}