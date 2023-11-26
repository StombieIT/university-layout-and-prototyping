export const createTnt = ({ isActive = false }) => {
    const tnt = document.createElement('img');
    tnt.id = 'tnt';
    tnt.src = './tnt.webp';
    tnt.alt = 'tnt';
    if (isActive) {
        tnt.classList.add('__active');
    }
    return tnt;
}