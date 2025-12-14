const selectors = document.querySelectorAll('.selector');
const categories = document.querySelectorAll('.category');
let nowSelected = 0
categories.forEach((cat) => {
    cat.style.display = 'none';
});
categories[nowSelected].style.display = 'block';
    
// selector
selectors.forEach((s) => {
    s.addEventListener('click', () => {
        // 시각효과
        const id = s.id;
        const selectorNum = parseInt(id.replaceAll('selector', ''));
        if (nowSelected == selectorNum) return;
        document.getElementById(`selector${nowSelected}`).classList.remove('selected');
        nowSelected = selectorNum;
        s.classList.add('selected');
        document.documentElement.style.setProperty('--paletteColor', getComputedStyle(s).getPropertyValue('--mainColor').trim());

        // 목록 전환
        categories.forEach((cat) => {
            cat.style.display = 'none';
        });
        categories[nowSelected].style.display = 'block';
    })
})
