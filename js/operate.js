import { funcs } from '/js/funcs.js'

const red = '#ed5351';
const gold = '#edc15a';

let errorOccured = false;
let isSeq = false;

const outputDiv = document.getElementById('output');
const inputDiv = document.getElementById('in');
const opBtn = document.getElementById('op-label');
const seqToggle = document.getElementById('sequence-toggle');
const mainWrapper = document.getElementById('main-wrapper');

opBtn.addEventListener('click', () => {
    if (seqToggle.checked) {
        alert('미구현')

    } else {
        startStream(mainWrapper, {});
    }
})

function getType(value) {
    if (/^-?\d+(\.\d+)?$/.test(value.trim())) {
        return 'Number';
    } else {
        return 'String';
    }
}

async function startStream(startWrapper, outerScope) {
    const variables = structuredClone(outerScope);
    let condState = 0;
    errorOccured = false;
    outputDiv.innerHTML = '';
    let nextDiv = startWrapper.querySelector(':scope > .next-block');
    let wrapper = nextDiv.querySelector(':scope > .block-wrapper');
    if (!wrapper) {
        write('System : 실행이 종료되었습니다.', gold);
        return;
    }
    let block = wrapper.querySelector(':scope > .block');
    while (block) {
        if (isSeq) {
            // 다음으로 버튼 눌릴 때까지 대기하는 로직
        }
        const blockId = block.dataset.id;
        const blockType = block.dataset.blocktype;
        const blockFunc = block.dataset.func;
        
        // placeholder
        const phs = block.querySelectorAll(':scope > .ph');
        const phObj = {};
        for (const ph of phs) {
            const key = ph.dataset.key;
            const vBlock = ph.querySelector(':scope > .value');
            if (vBlock) {
                phObj[key] = await getValue(vBlock, variables);
            } else {
                const content = ph.textContent;
                const type = getType(content);
                phObj[key] = {value: ph.textContent, type: type};
            }
        }
        phObj.CONDSTATE = condState;

        // 실행
        if (blockType === 'block') {
            await executeBlock(blockId, blockType, blockFunc, phObj, variables);
        } else if (blockType === 'cblock') {
            const stack = wrapper.querySelector(':scope > .stack');
            await executeBlock(blockId, blockType, blockFunc, phObj, variables);
        } else {
            alert('something invalid occured');
        }

        if (errorOccured) break;

        nextDiv = wrapper.querySelector(':scope > .next-block');
        if (!nextDiv) break;
        wrapper = nextDiv.querySelector(':scope > .block-wrapper');
        if (!wrapper) break;
        block = wrapper.querySelector(':scope > .block');
    }
    if (!errorOccured) write('System : 실행이 종료되었습니다.', gold);
    console.log(variables);


}

async function getValue(block, variables) {
    if (errorOccured) return;
    const vId = block.dataset.id;
    const vType = block.dataset.blocktype;
    const vFunc = block.dataset.func;
    
    const phs = block.querySelectorAll(':scope > .ph');
    const phObj = {};
    for (const ph of phs) {
        const key = ph.dataset.key;
        const vBlock = ph.querySelector(':scope > .value');
        if (vBlock) {
            phObj[key] = await getValue(vBlock, variables);
        } else {
            const content = ph.textContent;
            const type = getType(content);
            phObj[key] = {value: content, type: type};
        }
    }
    return await executeBlock(vId, vType, vFunc, phObj, variables);
}

async function executeBlock(id, type, func, phObj, variables) {
    try {
        const response = await funcs[func](phObj, variables);
        if (response.error) {
            errorOccured = true;
            write(response.content, red);
            return;
        }
        return response.content;
    } catch (err) {
        if (errorOccured) return;
        errorOccured = true;
        write(`Error : ${err}`, red);
        return;
    }
}

export function write(message, color) { 
    const line = document.createElement('p');
    line.classList.add('terminal-line');
    if (color) {
        line.style.color = color;
    }
    line.textContent = message;
    outputDiv.appendChild(line);
}