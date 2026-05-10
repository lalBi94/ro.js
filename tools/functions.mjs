import CanvasManager from "./CanvasManager.mjs";
import Vector2D from "./Vector2D.mjs";

/**
 * @param {{dim_x: Vector2D, dim_y: Vector2D, h_center: Vector2D, v_center: Vector2D, max_y_pos: Vector2D, max_x_pos: Vector2D, min_y_pos: Vector2D, min_x_pos: Vector2D}} plot 
 * @param {CanvasManager} cm 
 * @param {*} func
 * @param {*} x_step 
 */
function drawFunc(plot, cm, func=(x)=>Math.cos(x), x_step=1, color="black")
{
    const ctx = cm.getCtx()
    
    for(let i = plot.dim_x.x; i <= plot.dim_x.y; i+=x_step)
    {
        try
        {
            const y_res = safeComputing(func, i);
            if (!Number.isFinite(y_res)) continue;
            if (Math.abs(y_res) > plot.dim_x.y) continue;
            const pos = new Vector2D(plot.h_center.x+(i* plot.scale), plot.h_center.x-y_res* plot.scale);
            
            cm.createDot(pos,1,0,2*Math.PI,color, false, true);
        } catch(err)
        {
            continue;
        }
    }
}

function safeComputing(f, at)
{
    try
    {
        return f(at);        
    } catch(err)
    {
        return undefined;
    }
}

function primitiveEvolve(f,a,b)
{
    const b_res = safeComputing(f, b);
    const a_res = safeComputing(f, a);

    return safeComputing((x) => b_res-a_res, 0)
}

function createLineLambda(from, to, scale)
{
    const vec_step = to.add(from.scale(-1));
    return (t) => new Vector2D(from.x + t*vec_step.x, -from.y - t*vec_step.y).scale(scale)
}

function lambdify2DFromMathjs(f)
{
    return (x) => f.compile().evaluate({x})
}

/**
 * Reconnait que les structures {re,im}
 * @param {number | {re: number, im: number}} val 
 * @returns 
 */
function isComplex(val)
{
    try
    {
        return (val.re || val.im) ? true : false
    } catch(err)
    {
        return false;
    }
}

export default {
    drawFunc, 
    safeComputing, 
    primitiveEvolve, 
    lambdify2DFromMathjs, 
    createLineLambda,
    isComplex
}