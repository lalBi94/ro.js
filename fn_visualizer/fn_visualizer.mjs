import CanvasManager from "../tools/CanvasManager.mjs"
import rg from "../tools/RootGraph.mjs" 
import functions from "../tools/Functions.mjs"
import Vector2D from "../tools/Vector2D.mjs"
import Colors from "../tools/Colors.mjs"
import MegaState from "../tools/MegaState.mjs"

//const & param
const cm = new CanvasManager("canvas")
const cm_lasers = new CanvasManager("canvas-lasers")
const cm_integration = new CanvasManager("canvas-rect-integration")
const theChoosenOne = Colors.randomColorHex();
const theOppositeChoosenOne = Colors.complementColorHex(theChoosenOne) 

const initial_state = {
    plot: undefined,
    formulas_raw: [],
    formulas_derivatives: [],
    derivatives_funs_parsed: [],
    formulas: [],
    funs: [],
    scale: 60,
    par_min_axis_x_limit: -5,
    par_max_axis_x_limit: 5,
    par_max_axis_y_limit: 5,
    par_min_axis_y_limit: -5,
    par_axis_x_tag: "x",
    par_axis_y_tag: "y",
    par_step_dx: 0.02,
    par_axis_x_step: 1,
    par_axis_y_step: 1,
    derivative_dx: 0.1,
    integration_dx: 0.1
}

const initial_tags_name = [
    "#scale-info", "#scale-plus", "#scale-minus",
    "#pointed-dot-at-x", "#pointed-dot-at-y", "#pointed-dot-at-modulus", "#dy-dx", "#integration-res",
    "#formula-ipt", "#formula-latex",
    "*.dyn-color", "*.dyn-color-bg",
    "#par-max-x", "#par-min-x", "#par-max-y", "#par-min-y",
    "#par-step-btw-dot",
    "#par-x-tag", "#par-y-tag",
    "#par-x-axis-step", "#par-y-axis-step",
    "#par-derivative-tangent", "#par-derivative-dx",
    "#par-laser-x", "#par-laser-y", "#par-laser-modulus",
    "#par-integration-rectangle", "#par-integration-dx"
]

const par_name_pack = [
    "par-max-x", "par-min-x", "par-max-y", "par-min-y",
    "par-step-btw-dot",
    "par-x-tag", "par-y-tag",
    "par-x-axis-step", "par-y-axis-step",
    "par-derivative-dx",
    "par-integration-dx"
]

const mega_state = new MegaState({...initial_state}, [...initial_tags_name])

const par_pack = mega_state.getPackOfHTMLTags(par_name_pack);

//fns
function autoSwitchIntegrationRectangleButton(clickIfNotCheck)
{
    if(mega_state.getHTMLTag("par-integration-rectangle").checked && mega_state.getStateValue("formulas").length > 0)
    {
        mega_state.getHTMLTag("par-integration-rectangle").click();
        mega_state.getHTMLTag("par-integration-rectangle").click();
    } else if(!mega_state.getHTMLTag("par-integration-rectangle").checked && mega_state.getStateValue("formulas").length > 0 && clickIfNotCheck)
    {
        mega_state.getHTMLTag("par-integration-rectangle").click();
    }
}

function liveUpdatePrimitive()
{  
    if(mega_state.getStateValue("formulas_raw").length === 0)
    {
        mega_state.updateHTMLTagInnerText("integration-res", "[NOT DEFINED]");
        return;
    }

    mega_state.updateHTMLTagInnerText("integration-res", "");

    let root = "f", i = 0;
    for (let fstr of mega_state.getStateValue("formulas_raw"))
    {
        if(!fstr) continue;

        const current_letter_fun = String.fromCharCode(root.charCodeAt(0)+i);
        const formula_integration_raw = nerdamer(`integrate(${fstr})`).text();
        const formula_integration_latex = nerdamer.convertToLaTeX(formula_integration_raw);
        const formula_integration = math.parse(formula_integration_raw);
        const formula_integration_lambdify = functions.lambdify2DFromMathjs(formula_integration);
        const integration_res = functions.primitiveEvolve(formula_integration_lambdify, mega_state.getStateValue("par_min_axis_x_limit"), mega_state.getStateValue("par_max_axis_x_limit"))
        
        mega_state.updateHTMLTagInnerText(
            "integration-res", 
            `\\[ ${current_letter_fun.toUpperCase()}(x)=[${formula_integration_latex}]_{${mega_state.getStateValue("par_min_axis_x_limit")}}^{${mega_state.getStateValue("par_max_axis_x_limit")}}  + C=${integration_res.toFixed(3)} \\]`, 
            true
        );

        i++;
    }

    MathJax.typesetPromise([mega_state.getHTMLTag("integration-res")]);
}

function redraw()
{

    if(cm.stop_watch)
    {
        cm.toggleStopWatch();
    }

    cm.clearCtx()
    cm_lasers.clearCtx()

    mega_state.setStateValue(
        "plot",
        rg.showRootReal(
            cm, 
            mega_state.getStateValue("scale"), 
            mega_state.getStateValue("par_axis_y_tag"), 
            mega_state.getStateValue("par_axis_x_tag"),
            new Vector2D(mega_state.getStateValue("par_min_axis_x_limit"), mega_state.getStateValue("par_max_axis_x_limit")),
            new Vector2D(mega_state.getStateValue("par_max_axis_y_limit"), mega_state.getStateValue("par_min_axis_y_limit")),
            mega_state.getStateValue("par_axis_x_step"),
            mega_state.getStateValue("par_axis_y_step")
        )
    )
    
    for(let f of mega_state.getStateValue("funs"))
    {
        functions.drawFunc(
            mega_state.getStateValue("plot")
            , cm, f, mega_state.getStateValue("par_step_dx"), Colors.randomColorHex()
        )
    }

    mega_state.updateHTMLTagInnerText("formula-latex", mega_state.getStateValue("formulas").join(" "))
    MathJax.typesetPromise([mega_state.getHTMLTag("formula-latex")]);
}

mega_state.getHTMLTag("par-integration-rectangle").addEventListener("change", (e) => {
    if(mega_state.getStateValue("funs").length > 0 && e.target.checked)
    {
        for(let f of mega_state.getStateValue("funs"))
        {
            for(let i = mega_state.getStateValue("par_min_axis_x_limit"), alpha = mega_state.getStateValue("plot")?.min_x_pos; i <= mega_state.getStateValue("par_max_axis_x_limit"); i+=mega_state.getStateValue("integration_dx"))
            {
                const f_value = functions.safeComputing(f, i);
                if(f_value === undefined || isNaN(f_value)) continue;

                const valueInCanvasBase = cm.toCanvasBase(new Vector2D(0, -f_value*mega_state.getStateValue("scale")));

                const delta_x = new Vector2D(mega_state.getStateValue("integration_dx") * mega_state.getStateValue("scale"), 0);
                const beta = alpha.add(new Vector2D(delta_x.x, 0))
                const gamma = new Vector2D(
                    beta.x, 
                    valueInCanvasBase.y
                )
                const tau = gamma.add(new Vector2D(-delta_x.x, 0))

                cm_integration.createLine(alpha, beta, "red", false);
                cm_integration.createLine(beta, gamma, "red", false);
                cm_integration.createLine(gamma, tau, "red", false);
                cm_integration.createLine(tau, alpha, "red", false);

                alpha = beta
            }
        }
    } else
    {
        cm_integration.clearCtx()
    }
})

// process

mega_state.updateHTMLTagValue("par-max-x", mega_state.getStateValue("par_max_axis_x_limit"));
mega_state.updateHTMLTagValue("par-min-x", mega_state.getStateValue("par_min_axis_x_limit"));
mega_state.updateHTMLTagValue("par-max-y", mega_state.getStateValue("par_max_axis_y_limit"));
mega_state.updateHTMLTagValue("par-min-y", mega_state.getStateValue("par_min_axis_y_limit"));
mega_state.updateHTMLTagValue("par-step-btw-dot", mega_state.getStateValue("par_step_dx"));
mega_state.updateHTMLTagValue("par-x-tag", mega_state.getStateValue("par_axis_x_tag"));
mega_state.updateHTMLTagValue("par-y-tag", mega_state.getStateValue("par_axis_y_tag"));
mega_state.updateHTMLTagValue("par-x-axis-step", mega_state.getStateValue("par_axis_x_step"));
mega_state.updateHTMLTagValue("par-y-axis-step", mega_state.getStateValue("par_axis_y_step"));
mega_state.updateHTMLTagValue("par-derivative-dx", mega_state.getStateValue("derivative_dx"));
mega_state.updateHTMLTagValue("par-integration-dx", mega_state.getStateValue("integration_dx"));
mega_state.updateHTMLTagInnerText("scale-info", `x${mega_state.getStateValue("scale").toFixed(2)}`);

redraw();

for(let dc of mega_state.getHTMLTag("dyn-color"))
{
    dc.style.color = theChoosenOne;
}

for(let dc of mega_state.getHTMLTag("dyn-color-bg"))
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
                if(val < par.value) 
                {
                    par.value = mega_state.getStateValue("par_max_axis_x_limit");
                    return;
                }
                mega_state.setStateValue("par_max_axis_x_limit", val);
                liveUpdatePrimitive()
                break;
            case "par-min-x":
                if(val > par.value) {
                    par.value = mega_state.getStateValue("par_min_axis_x_limit");
                    return;
                }
                mega_state.setStateValue("par_min_axis_x_limit", val);
                liveUpdatePrimitive()
                break;
            case "par-max-y":
                if(val < par.value) {
                    par.value = mega_state.getStateValue("par_max_axis_y_limit");
                    return;
                }
                mega_state.setStateValue("par_max_axis_y_limit", val)
                liveUpdatePrimitive()
                break;
            case "par-min-y":
                if(val > par.value) {
                    par.value = mega_state.getStateValue("par_min_axis_y_limit");
                    liveUpdatePrimitive()
                    return;
                }
                mega_state.setStateValue("par_min_axis_y_limit", val)
                break;
            case "par-step-btw-dot":
                if(val <= 0) {
                    par.value = mega_state.getStateValue("par_step_dx");
                    return;
                }
                mega_state.setStateValue("par_step_dx", val)
                break;
            case "par-x-tag":
                mega_state.setStateValue("par_axis_x_tag", e.target.value);
                break;
            case "par-y-tag":
                mega_state.setStateValue("par_axis_y_tag", e.target.value);
                break;
            case "par-x-axis-step":
                if(val <= 0) {
                    par.value = mega_state.getStateValue("par_axis_x_step");
                    return;
                }
                mega_state.setStateValue("par_axis_x_step", val);
                break;
            case "par-y-axis-step":
                if(val <= 0) {
                    par.value = mega_state.getStateValue("par_axis_y_step");
                    return;
                }
                mega_state.setStateValue("par_axis_y_step", val);
                break;

            case "par-derivative-dx":
                if(val === 0.0) {
                    par.value = mega_state.getStateValue("derivative_dx");
                    return;
                }
                mega_state.setStateValue("derivative_dx", val);
                break;

            case "par-integration-dx":
                if(val === 0.0) {
                    par.value = mega_state.getStateValue("integration_dx");;
                    return;
                }
                mega_state.setStateValue("integration_dx", val);

                autoSwitchIntegrationRectangleButton()

                break;
        }

        redraw()
    })
}

mega_state.getHTMLTag("formula-ipt").addEventListener("change", (e) => {
    try
    {
        mega_state.setStateValue("formulas", [])
        mega_state.setStateValue("funs", [])
        mega_state.setStateValue("derivatives_funs_parsed", [])
        mega_state.setStateValue("formulas_derivatives", [])

        const splited = e.target.value.replaceAll("\n", "").replaceAll(" ", "").split(";").filter((s) => s !== "");

        mega_state.setStateValue("formulas_raw", [...splited])

        let root = 'f', i = 0;

        for(let spl of splited)
        {
            if(!spl) continue;

            const formula_parsed = math.parse(spl)
            const current_letter_fun = String.fromCharCode(root.charCodeAt(0)+i);

            try
            { 
                const formula_derivative = math.derivative(formula_parsed, "x");

                /**
                TODO: PRobleme mega staqte.
                 */
                mega_state.actionOnArrayState(
                    "formulas_derivatives", 
                    "push",
                    `\\[ ${current_letter_fun}(x)'=${formula_derivative.toTex()}={{res}} \\] `
                );

                mega_state.actionOnArrayState(
                    "derivatives_funs_parsed",
                    "push",
                    formula_derivative
                );
            } catch(err)
            {
                console.error(err);
            } finally
            {
                mega_state.actionOnArrayState(
                    "formulas",
                    "push",
                    `\\[ ${current_letter_fun}(x)=${formula_parsed.toTex()} \\]`
                )
                
                mega_state.actionOnArrayState(
                    "funs",
                    "push",
                    (x) => (formula_parsed.compile().evaluate({x}))
                )
                
                i++;
            }
        }

        try {
            liveUpdatePrimitive()
        } catch(err) {
            console.error(err)
        }

        autoSwitchIntegrationRectangleButton(false)
        
        redraw()
    } catch(err) {};
});

mega_state.getHTMLTag("scale-plus").addEventListener("click", () => {
    mega_state.setStateValue("scale", mega_state.getStateValue("scale")*1.5);
    mega_state.updateHTMLTagInnerText("scale-info", `x${mega_state.getStateValue("scale").toFixed(2)}`)
    redraw()
    autoSwitchIntegrationRectangleButton(false)
})

mega_state.getHTMLTag("scale-minus").addEventListener("click", () => {
    if((mega_state.getStateValue("scale")/1.5) < 0) return;
    mega_state.setStateValue("scale", mega_state.getStateValue("scale")/1.5);
    mega_state.updateHTMLTagInnerText("scale-info", `x${mega_state.getStateValue("scale").toFixed(2)}`)
    redraw()
    autoSwitchIntegrationRectangleButton(false)
})

cm.canvas.addEventListener("click", () => {
    cm.toggleStopWatch();
})

const process = (event) => {
    if(cm.stop_watch) return;

    redraw()
    const rect = cm.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);

    const alpha = new Vector2D(x, y)
    const xy_cursor = alpha.add(new Vector2D(-cm.center.x, -cm.center.y))
        .scale(1/mega_state.getStateValue("scale"))

    const compute_points = []
    const compute_derivative_points = []

    for(let dfp of mega_state.getStateValue("derivatives_funs_parsed"))
    {
        let df_val = dfp.evaluate({x: xy_cursor.x});
        compute_derivative_points.push(df_val)
    }

    mega_state.updateHTMLTagInnerText("dy-dx", "")

    for(let dfs in mega_state.getStateValue("formulas_derivatives"))
    {
        const df_val = compute_derivative_points[dfs];
        if(functions.isComplex(df_val)) 
        {
            mega_state.updateHTMLTagInnerText(
                "dy-dx", 
                mega_state.getStateValue("formulas_derivatives")[dfs].replaceAll(
                    "{{res}}", 
                    `${df_val.re.toFixed(3)}+i(${df_val.im.toFixed(3)})`
                ), 
                true
            );
        } else
        {

            mega_state.updateHTMLTagInnerText(
                "dy-dx", 
                mega_state.getStateValue("formulas_derivatives")[dfs].replaceAll(
                    "{{res}}", 
                    df_val.toFixed(3)
                ), 
                true
            );
        }
    }

    MathJax.typesetPromise([mega_state.getHTMLTag("dy-dx")]);

    for(let f of mega_state.getStateValue("funs"))
    {
        const f_val = functions.safeComputing(f, xy_cursor.x);
        const f_val_dx = functions.safeComputing(f, xy_cursor.x + mega_state.getStateValue("derivative_dx"));
        if((f_val === undefined) || (f_val_dx === undefined)) continue;

        if(functions.isComplex(f_val))
        {
            compute_points.push({
                value: f_val,
                localisation: null,
            })   
            continue;
        }

        const value = f_val
        const localisation = cm.toCanvasBase(
            new Vector2D(
                mega_state.getStateValue("scale") * xy_cursor.x, 
                -mega_state.getStateValue("scale") * f_val
            )
        )

        const next_dx_value = f_val_dx
        const next_localisation = cm.toCanvasBase(
            new Vector2D(
                mega_state.getStateValue("scale") * (xy_cursor.x + mega_state.getStateValue("derivative_dx")), 
                -mega_state.getStateValue("scale") * f_val_dx
            )
        );

        if((f_val <= mega_state.getStateValue("par_max_axis_y_limit")) || (f_val >= mega_state.getStateValue("par_min_axis_y_limit"))) 
        {
            compute_points.push({
                value,
                localisation,
            })   
        }

        // derivative
        if(mega_state.getHTMLTag("par-derivative-tangent").checked)
        {
            const vec = new Vector2D(xy_cursor.x, value);
            const vec_next = new Vector2D(xy_cursor.x + mega_state.getStateValue("derivative_dx"), next_dx_value);

            for(let i = -17; i <= 17; i+=0.025)
            {
                const lde_val = functions.safeComputing(functions.createLineLambda(vec, vec_next, mega_state.getStateValue("scale")), i);
                if(!lde_val) continue;

                const compute_ld = cm.toCanvasBase(lde_val)
                cm_lasers.createDot(compute_ld,0.2,0,2*Math.PI,"black", false, true);
                cm_lasers.createDot(localisation,4,0,2*Math.PI,"black", false, true);
                cm_lasers.createDot(next_localisation,4,0,2*Math.PI,"black", false, true);
            }
        }
    }

    mega_state.updateHTMLTagInnerText("pointed-dot-at-x", (xy_cursor.x >= 0 ? "+" : "-") + (Math.abs(xy_cursor.x).toFixed(3)))
    mega_state.updateHTMLTagInnerText("pointed-dot-at-y", "")
    mega_state.updateHTMLTagInnerText("pointed-dot-at-modulus", "")

    let root = 'f', i = 0;
    MathJax.typesetPromise([mega_state.getHTMLTag("pointed-dot-at-modulus")]);

    for(let cp of compute_points)
    {
        mega_state.updateHTMLTagInnerHtml(
            "pointed-dot-at-modulus", 
            String.fromCharCode(root.charCodeAt(0)+i) + 
                "(x)=" + "+" + Math.sqrt(Math.pow(Math.abs(xy_cursor.x), 2) + 
                Math.pow(Math.abs(cp.value), 2)).toFixed(3) + "&#10;",
            true
        )

        if(functions.isComplex(cp.value))
        {
            mega_state.updateHTMLTagInnerHtml(
                "pointed-dot-at-y", 
                String.fromCharCode(root.charCodeAt(0)+i) + 
                    "(x)=" + `${cp.value.re.toFixed(3)}+i(${cp.value.im.toFixed(3)})` + "&#10;",
                true
            )
            continue;
        } else
        {
            mega_state.updateHTMLTagInnerHtml(
                "pointed-dot-at-y", 
                String.fromCharCode(root.charCodeAt(0)+i) + 
                    "(x)=" + (cp.value > 0 ? "+" : "-") + ((Math.abs(cp.value)).toFixed(3)) + "&#10;",
                true
            )
                
        }

        cm.ctx.strokeStyle = "black";
        cm.ctx.beginPath();
        cm.ctx.arc(cp.localisation.x, cp.localisation.y, 3, 0, 2 * Math.PI);
        cm.ctx.stroke();
        
        if(mega_state.getHTMLTag("par-laser-x").checked)
        {
            cm_lasers.createLine(cp.localisation, new Vector2D(cm.center.x, cp.localisation.y), "blue", true)
        }
        
        if(mega_state.getHTMLTag("par-laser-y").checked)
        {
            cm_lasers.createLine(cp.localisation, new Vector2D(cp.localisation.x, cm.center.y), "red", true)
        }
        
        if(mega_state.getHTMLTag("par-laser-modulus").checked)
        {
            cm_lasers.createLine(cp.localisation, cm.center, "green", true)
        }
        
        i++;
    }

    if(mega_state.getHTMLTag("pointed-dot-at-y").innerText.length === 0)
    {
        mega_state.updateHTMLTagInnerText("pointed-dot-at-y", "[NOT DEFINED]")
    }

    if(mega_state.getHTMLTag("pointed-dot-at-modulus").innerText.length === 0)
    {
        mega_state.updateHTMLTagInnerText("pointed-dot-at-modulus", "[NOT DEFINED]")
    }

    if (mega_state.getHTMLTag("dy-dx").innerText.length === 0)
    {
        mega_state.updateHTMLTagInnerText("dy-dx", "[NOT DEFINED]")
    }
}

let pending_cmv = false;
cm.canvas.addEventListener('mousemove', (event) => {
    if(!mega_state.getStateValue("plot")) return;

    if (!pending_cmv) {
        pending_cmv = true;
        requestAnimationFrame(() => {
            process(event)
            pending_cmv = false;
        });
    }
});