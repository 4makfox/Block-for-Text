import { grabBlock, grabValue, displayMenu } from '/js/interaction.js';

const categories = document.querySelectorAll('.category');
const workspace = document.getElementById('workspace');

const blockJSON = await fetch('../data/blocks.json');
const blockData = await blockJSON.json();

function createBlock(data) {
    const cat = data.category;
    const bType = data.blocktype;
    let block;
    
    if (bType === 'block') {
        block = document.createElement('div');
        block.classList.add('source-block', `color${cat}`, `origin_${data.id}`);
    } else if (bType === 'value') {
        block = document.createElement('span');
        block.contentEditable = false;
        block.classList.add('source-value', `color${cat}`, `origin_${data.id}`);
    } else if (bType === 'cblock') {
        block = document.createElement('div');
        block.classList.add('source-cblock', `color${cat}`, `origin_${data.id}`);
    }
    
    block.dataset.id = data.id;
    block.dataset.blocktype = bType;
    block.dataset.func = data.func;
    
    const fragment = document.createDocumentFragment();
    data.tokens.forEach((cnt) => {
        let element;
        if (cnt.type === 'text') {
            element = document.createTextNode(cnt.value);
        } else if (cnt.type === 'placeholder') {
            element = document.createElement('span');
            element.classList.add('ph');
            element.dataset.key = cnt.key;
            element.setAttribute('contenteditable', 'true');
            element.textContent = data.default[cnt.key];
        }
        fragment.appendChild(element);
    })
    block.appendChild(fragment);
    return block;
}

// 추가
blockData.forEach((data) => {
    const cat = data.category;
    const block = createBlock(data);
    
    if (data.blocktype === 'block') {
        block.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            const bigDiv = document.createElement('div');
            bigDiv.classList.add('block-wrapper');
            
            const newBlock = block.cloneNode(true);
            newBlock.classList.remove('source-block', `origin_${data.id}`);
            newBlock.classList.add('block');
    
            newBlock.addEventListener('mousedown', (dragEvent) => {
                if (document.elementFromPoint(dragEvent.clientX, dragEvent.clientY).classList.contains('ph')) return;
                grabBlock(bigDiv, dragEvent, false, '');
            })
            newBlock.addEventListener('contextmenu', (e) => {
                displayMenu(e, bigDiv);
            });
    
            const nextDiv = document.createElement('div');
            nextDiv.classList.add('next-block');
            
            bigDiv.appendChild(newBlock);
            bigDiv.appendChild(nextDiv);
            workspace.appendChild(bigDiv);
            grabBlock(bigDiv, e, true, data.id);
        })
        categories[cat].appendChild(block);
    } else if (data.blocktype === 'value') {
        block.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;            
            const newBlock = block.cloneNode(true);
            newBlock.classList.remove('source-value', `origin_${data.id}`);
            newBlock.classList.add('value');
    
            newBlock.addEventListener('mousedown', (dragEvent) => {
                if (document.elementFromPoint(dragEvent.clientX, dragEvent.clientY).classList.contains('ph')) return;
                grabValue(newBlock, dragEvent, false, '');
            })
            newBlock.addEventListener('contextmenu', (e) => {
                displayMenu(e, newBlock);
            });
            workspace.appendChild(newBlock);
            grabValue(newBlock, e, true, data.id);
        })
        categories[cat].appendChild(block);
    } else if (data.blocktype === 'cblock') {
        const wrapper = document.createElement('div');
        wrapper.classList.add('cblock', 'cblock-display');
        const middle = document.createElement('div');
        middle.classList.add('cblock-middle');
        const left = document.createElement('div');
        left.classList.add('cblock-left', `color${cat}`);
        const stack = document.createElement('div');
        stack.classList.add('stack');
        const bottom = document.createElement('div');
        bottom.classList.add('cblock-bottom', `color${cat}`, 'cblock-bottom-imsi');
        

        // cblock 기준으로 다 바꾸기
        // cblock-wrapper 몰라 거나읠ㄴㅇㄹㄴㅇㄹㅇㄴㄹㄴㅇ
        block.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            const bigDiv = document.createElement('div');
            bigDiv.classList.add('block-wrapper');
            
            const cblock = wrapper.cloneNode(true);
            cblock.classList.remove('cblock-display');
            const top = cblock.querySelector(':scope > .source-cblock');
            top.classList.remove('source-cblock', `origin_${data.id}`);
            top.classList.add('cblock-top');
    
            cblock.addEventListener('mousedown', (dragEvent) => {
                if (document.elementFromPoint(dragEvent.clientX, dragEvent.clientY).classList.contains('ph')) return;
                grabBlock(bigDiv, dragEvent, false, '');
            })
            cblock.addEventListener('contextmenu', (e) => {
                displayMenu(e, bigDiv);
            });
    
            const nextDiv = document.createElement('div');
            nextDiv.classList.add('next-block');
            stack.classList.add('.next-block')
            
            bigDiv.appendChild(cblock);
            bigDiv.appendChild(nextDiv);
            workspace.appendChild(bigDiv);
            grabBlock(bigDiv, e, true, data.id);
        })

        middle.appendChild(left);
        middle.appendChild(stack);
        wrapper.appendChild(block);
        wrapper.appendChild(middle);
        wrapper.appendChild(bottom);
        categories[cat].appendChild(wrapper);
    }
})