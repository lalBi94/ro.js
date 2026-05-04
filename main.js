import CanvasManager from "./tools/CanvasManager.mjs"
import rg from "./tools/rootGraph.mjs" 
import functions from "./tools/functions.mjs"
import Vector2D from "./tools/Vector2D.mjs"
import Colors from "./tools/Colors.mjs"

const cm = new CanvasManager()
const theChoosenOne = Colors.randomColorHex();
const theOppositeChoosenOne = Colors.complementColorHex(theChoosenOne) 
let scale = 60
let plot = undefined;
let formulas = [`x^2`]
let funs = [(x) => x**2];

//fns
function redraw()
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
        functions.drawFunc(plot, cm, f, .02, Colors.randomColorHex())
    }

    formula_latex_$.innerText = formulas.join(" ")
    MathJax.typesetPromise([formula_latex_$]);
}

//balises
const stats_scale_$ = document.getElementById("scale-info")
const btn_scale_plus$ = document.getElementById("scale-plus")
const btn_scale_minus$ = document.getElementById("scale-minus")
const x_cursor_$ = document.getElementById("pointed-dot-at-x");
const y_cursor_$ = document.getElementById("pointed-dot-at-y");
const modulus_cursor_$ = document.getElementById("pointed-dot-at-modulus");
const formula_ipt_$ = document.getElementById("formula-ipt");
const formula_latex_$ = document.getElementById("formula-latex");
const all_dyn_colored_$ = document.querySelectorAll(".dyn-color");
const all_dyn_colored_bg_$ = document.querySelectorAll(".dyn-color-bg");

redraw()

stats_scale_$.innerText = "x" + scale
formula_latex_$.innerText = `\\( f(x)=${math.parse(formulas[0]).toTex()} \\)`;

for(let dc of all_dyn_colored_$)
{
    dc.style.color = theChoosenOne;
}

for(let dc of all_dyn_colored_bg_$)
{
    dc.style.background = theChoosenOne;
    dc.style.color = theOppositeChoosenOne;
}

// events
formula_ipt_$.addEventListener("change", (e) => {
    try
    {
        formulas = []
        funs = []

        const splited = e.target.value.replaceAll("\n", "").split(";");

        let root = 'f', i = 0;
        for(let spl of splited)
        {
            if(!spl) continue;
            const formula_parsed = math.parse(spl)
            formulas.push(`\\[ ${String.fromCharCode(root.charCodeAt(0)+i)}(x)=${formula_parsed.toTex()} \\]`);
            funs.push((x) => (formula_parsed.compile().evaluate({x})))
            i++;
        }

        redraw()
    } catch(err) {console.log(err)};
});

btn_scale_plus$.addEventListener("click", () => {
    scale *= 1.5
    stats_scale_$.innerText = "x" + scale.toFixed(2)
    redraw()
})

btn_scale_minus$.addEventListener("click", () => {
    if((scale/1.5) < 0) return;
    scale /= 1.5
    stats_scale_$.innerText = "x" + scale.toFixed(2)
    redraw()
})

cm.canvas.addEventListener('click', (event) => {
    if(!plot) return;
    redraw()

    const rect = cm.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);

    const alpha = new Vector2D(x, y)
    const xy_cursor = alpha.add(new Vector2D(-cm.center.x, -cm.center.y)).scale(1/scale);

    const compute_points = []

    for(let f of funs)
    {
        compute_points.push({
            value: f(xy_cursor.x), 
            localisation: new Vector2D(
                cm.center.x + xy_cursor.x * scale, 
                cm.center.y - f(xy_cursor.x) * scale
            )
        })
    }

    x_cursor_$.innerText = (xy_cursor.x >= 0 ? "+" : "-") + (Math.abs(xy_cursor.x).toFixed(3));
    y_cursor_$.innerText = "";
    modulus_cursor_$.innerText = "";
    let root = 'f', i = 0;
    MathJax.typesetPromise([modulus_cursor_$]);

    for(let cp of compute_points)
    {
        y_cursor_$.innerText += String.fromCharCode(root.charCodeAt(0)+i) + 
            "(x)=" + (cp.value > 0 ? "+" : "-") + ((Math.abs(cp.value)).toFixed(3)) + ", ";

        modulus_cursor_$.innerText += String.fromCharCode(root.charCodeAt(0)+i) + 
            "(x)=" + "+" + Math.sqrt(Math.pow(Math.abs(xy_cursor.x), 2) + 
            Math.pow(Math.abs(cp.value), 2)).toFixed(3) + ", ";

        cm.ctx.strokeStyle = "black";
        cm.ctx.beginPath();
        cm.ctx.arc(cp.localisation.x, cp.localisation.y, 3, 0, 2 * Math.PI);
        cm.ctx.stroke();
        cm.ctx.closePath();
        
        rg.createLine(cm.ctx, cp.localisation, new Vector2D(cm.center.x, cp.localisation.y), "blue", true)
        rg.createLine(cm.ctx, cp.localisation, new Vector2D(cp.localisation.x, cm.center.y), "red", true)
        rg.createLine(cm.ctx, cp.localisation, cm.center, "green", true)
        
        i++;
    }
});

