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

const complementColorHex = (hex) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');

    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 0.5 ? '#000000' : '#ffffff';
};

export default {complementColorHex, randomColorHex}