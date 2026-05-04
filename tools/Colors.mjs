const randomColorHex = () => {
    const hueRanges = [
        [160, 190],
        [200, 230], 
        [240, 270],
        [280, 320],
        [10, 30], 
        [80, 130],
    ];
    const [hMin, hMax] = hueRanges[Math.floor(Math.random() * hueRanges.length)];
    const h = hMin + Math.random() * (hMax - hMin);

    const s = 0.35 + Math.random() * 0.20;
    const l = 0.38 + Math.random() * 0.14;

    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

const complementColorHex = (h) => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
    const toLin = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const luma = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
    return luma > 0.18 ? '#0a0a0a' : '#fafafa';
};

export default {complementColorHex, randomColorHex}