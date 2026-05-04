import CanvasManager from "./canvas_manager.mjs"
import rg from "./tools/rootGraph.mjs" 
import functions from "./tools/functions.mjs"
import Vector2D from "./tools/Vector2D.mjs"

let scale = 60
const cm = new CanvasManager()
let plot = undefined;
let formulas = [`x^2`]
let funs = [(x) => x**2];

/**
 * Scale
 */
const stats_scale_$ = document.getElementById("scale-info")
const btn_scale_plus$ = document.getElementById("scale-plus")
const btn_scale_minus$ = document.getElementById("scale-minus")
const x_cursor_$ = document.getElementById("pointed-dot-at-x");
const y_cursor_$ = document.getElementById("pointed-dot-at-y");
const modulus_cursor_$ = document.getElementById("pointed-dot-at-modulus");
const formula_ipt_$ = document.getElementById("formula-ipt");
const formula_latex_$ = document.getElementById("formula-latex");

const randomColorHex = () => {
    const ranges = [[140, 200], [200, 280], [280, 340]];
    const [min, max] = ranges[Math.floor(Math.random() * ranges.length)];
    const h = min + Math.random() * (max - min);
    const l = 0.4 + Math.random() * 0.1;
    const a = 0.95 * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

function create_instance()
{
    cm.clearCtx()
    plot = rg.showRootReal(
        cm, 
        scale, 
        "y", 
        "x",
        new Vector2D(-5, 5),
        new Vector2D(5, -5),
        0.5,
        0.5
    )
    
    for(let f of funs)
    {
        functions.drawFunc(plot, cm, f, .01, randomColorHex())
    }

    formula_latex_$.innerText = formulas.join(" ")
    MathJax.typesetPromise([formula_latex_$]);
}

create_instance()

stats_scale_$.innerText = "x" + scale
formula_latex_$.innerText = `\\( f(x)=${math.parse(formulas[0]).toTex()} \\)`;

formula_ipt_$.addEventListener("change", (e) => {
    try
    {
        formulas = []
        funs = []

        const splited = e.target.value.split("\n");

        let root = 'f', i = 0;
        for(let spl of splited)
        {
            const formula_parsed = math.parse(spl)
            formulas.push(`\\[ ${String.fromCharCode(root.charCodeAt(0)+i)}(x)=${formula_parsed.toTex()} \\]`);
            funs.push((x) => (formula_parsed.compile().evaluate({x})))
            i++;
        }

        create_instance()
    } catch(err) {console.log(err)};
});

btn_scale_plus$.addEventListener("click", () => {
    scale *= 1.5
    stats_scale_$.innerText = "x" + scale.toFixed(2)
    create_instance()
})

btn_scale_minus$.addEventListener("click", () => {
    if((scale/1.5) < 0) return;
    scale /= 1.5
    stats_scale_$.innerText = "x" + scale.toFixed(2)
    create_instance()
})

let flag = 0;
cm.canvas.addEventListener('click', (event) => {
    if(!plot) return;
    flag += flag === 0 ? 1 : -1;
    create_instance()

    const rect = cm.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);

    const alpha = new Vector2D(x, y)
    const xy_cursor = alpha.add(new Vector2D(-cm.center.x, -cm.center.y)).scale(1/scale);

    x_cursor_$.innerText = (xy_cursor.x >= 0 ? "+" : "-") + (Math.abs(xy_cursor.x).toFixed(3));
    y_cursor_$.innerText = (xy_cursor.y < 0 ? "+" : "-") + ((Math.abs(xy_cursor.y)).toFixed(3));
    modulus_cursor_$.innerText = "+" + Math.sqrt(Math.pow(Math.abs(xy_cursor.x),2)+Math.pow(Math.abs(xy_cursor.y),2)).toFixed(3);
    MathJax.typesetPromise([modulus_cursor_$]);

    console.log(alpha, new Vector2D(cm.center.x, alpha.y))

    cm.ctx.strokeStyle = "black";
    cm.ctx.beginPath();
    cm.ctx.arc(alpha.x, alpha.y, 3, 0, 2 * Math.PI);
    cm.ctx.stroke();

    rg.createLine(cm.ctx, alpha, new Vector2D(cm.center.x, alpha.y), "blue")
    rg.createLine(cm.ctx, alpha, new Vector2D(alpha.x, cm.center.y), "red")
    rg.createLine(cm.ctx, alpha, cm.center, "green")
});

