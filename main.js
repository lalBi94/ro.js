import CanvasManager from "./tools/CanvasManager.mjs"
import rg from "./tools/rootGraph.mjs" 
import functions from "./tools/functions.mjs"
import Vector2D from "./tools/Vector2D.mjs"
import Colors from "./tools/Colors.mjs"

// const body = document.querySelector("body");
// body.innerHTML = body.innerHTML.replaceAll("{{strike}}", "ta mere")

const cm = new CanvasManager()
const theChoosenOne = Colors.randomColorHex();
const theOppositeChoosenOne = Colors.complementColorHex(theChoosenOne) 
let scale = 60
let plot = undefined;
let formulas = []
let funs = [];
let par_min_axis_x_limit = -50;
let par_max_axis_x_limit = 50;
let par_max_axis_y_limit = 50;
let par_min_axis_y_limit = -50;
let par_axis_x_tag = "x";
let par_axis_y_tag = "y";
let par_step_dx = 0.02;
let par_axis_x_step = 1;
let par_axis_y_step = 1;
let derivative_dx = 0.1;

//fns
function redraw()
{
    cm.clearCtx()
    plot = rg.showRootReal(
        cm, 
        scale, 
        par_axis_y_tag, 
        par_axis_x_tag,
        new Vector2D(par_min_axis_x_limit, par_max_axis_x_limit),
        new Vector2D(par_max_axis_y_limit, par_min_axis_y_limit),
        par_axis_x_step,
        par_axis_y_step
    )
    
    for(let f of funs)
    {
        functions.drawFunc(plot, cm, f, par_step_dx, Colors.randomColorHex())
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

const par_max_x_ipt_$ = document.getElementById("par-max-x");
const par_min_x_ipt_$ = document.getElementById("par-min-x");
const par_max_y_ipt_$ = document.getElementById("par-max-y");
const par_min_y_ipt_$ = document.getElementById("par-min-y");

const par_step_btw_dot_$ = document.getElementById("par-step-btw-dot");

const par_x_tag_$ = document.getElementById("par-x-tag");
const par_y_tag_$ = document.getElementById("par-y-tag");

const par_x_axis_step_$ = document.getElementById("par-x-axis-step");
const par_y_axis_step_$ = document.getElementById("par-y-axis-step");

const par_pack = [
    par_max_x_ipt_$, par_min_x_ipt_$, par_max_y_ipt_$, par_min_y_ipt_$,
    par_step_btw_dot_$, 
    par_x_tag_$, par_y_tag_$,
    par_x_axis_step_$, par_y_axis_step_$
]

const par_laser_x_$ = document.getElementById("par-laser-x");
const par_laser_y_$ = document.getElementById("par-laser-y");
const par_laser_modulus_$ = document.getElementById("par-laser-modulus");

console.log(par_laser_x_$.checked)
console.log(par_laser_y_$.checked)
console.log(par_laser_modulus_$.checked)

par_max_x_ipt_$.value = par_max_axis_x_limit
par_min_x_ipt_$.value = par_min_axis_x_limit
par_max_y_ipt_$.value = par_max_axis_y_limit
par_min_y_ipt_$.value = par_min_axis_y_limit
par_step_btw_dot_$.value = par_step_dx
par_x_tag_$.value = par_axis_x_tag
par_y_tag_$ .value = par_axis_y_tag
par_x_axis_step_$.value = par_axis_x_step
par_y_axis_step_$.value = par_axis_y_step

stats_scale_$.innerText = "x" + scale

redraw();

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
for(let par of par_pack)
{
    par.addEventListener("change", (e) => {
        const val = e.target.type === "number" ? 
            parseFloat(e.target.value) : e.target.value;
        
        switch(e.target.id)
        {
            case "par-max-x":
                if(val < 0) 
                {
                    par_max_x_ipt_$.value = par_max_axis_x_limit;
                    return;
                }
                par_max_axis_x_limit = val;
                break;
            case "par-min-x":
                if(val > 0 ) {
                    par_min_x_ipt_$.value = par_min_axis_x_limit;
                    return;
                }
                par_min_axis_x_limit = val;
                break;
            case "par-max-y":
                if(val < 0 ) {
                    par_max_y_ipt_$.value = par_max_axis_y_limit;
                    return;
                }
                par_max_axis_y_limit = val;
                break;
            case "par-min-y":
                if(val > 0) {
                    par_min_y_ipt_$.value = par_min_axis_y_limit;
                    return;
                }
                par_min_axis_y_limit = val;
                break;
            case "par-step-btw-dot":
                if(val <= 0) {
                    par_step_btw_dot_$.value = par_step_dx;
                    return;
                }
                par_step_dx = val;
                break;
            case "par-x-tag":
                par_axis_x_tag = e.target.value
                break;
            case "par-y-tag":
                par_axis_y_tag = e.target.value
                break;
            case "par-x-axis-step":
                if(val <= 0) {
                    par_x_axis_step_$.value = par_axis_x_step;
                    return;
                }
                par_axis_x_step = val
                break;
            case "par-y-axis-step":
                if(val <= 0) {
                    par_y_axis_step_$.value = par_axis_y_step;
                    return;
                }
                par_axis_y_step = val
                break;
        }

        console.log(e.target.id, e.target.value)

        redraw()
    })
}

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

let stop_watch = false;

cm.canvas.addEventListener("click", () => {
    stop_watch = !stop_watch;
})

let pending = false;
const process = (event) => {
    if(stop_watch) return;

    redraw()
    const rect = cm.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);

    const alpha = new Vector2D(x, y)
    const xy_cursor = alpha.add(new Vector2D(-cm.center.x, -cm.center.y))
        .scale(1/scale)

    const compute_points = []

    for(let f of funs)
    {
        const value = f(xy_cursor.x)
        const localisation = cm.toCanvasBase(
            new Vector2D(
                scale * xy_cursor.x, 
                -scale*f(xy_cursor.x)
            )
        )
        
        const next_dx_value = f(xy_cursor.x+derivative_dx)
        const next_localisation = cm.toCanvasBase(
            new Vector2D(
                scale * (xy_cursor.x + derivative_dx), 
                -scale*f(xy_cursor.x+derivative_dx)
            )
        );

        compute_points.push({
            value,
            localisation,
        })

        // derivative
        const vec = new Vector2D(xy_cursor.x, value);
        const vec_next = new Vector2D(xy_cursor.x+derivative_dx, next_dx_value);
        const vec_step = vec_next.add(vec.scale(-1));

        const lambda_derivative_eqwa = (t) => 
            new Vector2D(vec.x + t*vec_step.x, -vec.y - t*vec_step.y).scale(scale)

        for(let i = -10; i < 10; i+=0.02)
        {
            const compute_ld = cm.toCanvasBase(lambda_derivative_eqwa(i))
            cm.createDot(compute_ld,0.2,0,2*Math.PI,"black", false, true);
        }
        
        cm.createLine(localisation, next_localisation, "black", false);

        cm.createDot(localisation,5,0,2*Math.PI,"black", false, true);
        cm.createDot(next_localisation,5,0,2*Math.PI,"black", false, true);
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
        
        if(par_laser_x_$.checked)
        {
            cm.createLine(cp.localisation, new Vector2D(cm.center.x, cp.localisation.y), "blue", true)
        }
        
        if(par_laser_y_$.checked)
        {
            cm.createLine(cp.localisation, new Vector2D(cp.localisation.x, cm.center.y), "red", true)
        }
        
        if(par_laser_modulus_$.checked)
        {
            cm.createLine(cp.localisation, cm.center, "green", true)
        }
        
        i++;
    }

    if(y_cursor_$.innerText.length === 0)
    {  
        y_cursor_$.innerText = "[NO FUNCTION]"
    }

    if(modulus_cursor_$.innerText.length === 0)
    {  
        modulus_cursor_$.innerText = "[NO FUNCTION]"
    }
}
cm.canvas.addEventListener('mousemove', (event) => {
    if(!plot) return;

    if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
            process(event)
            pending = false;
        });
    }
});