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
            const y_res = func(i)
            if (!Number.isFinite(y_res)) continue;
            if (Math.abs(y_res) > plot.dim_x.y) continue;
            const pos = new Vector2D(plot.h_center.x+(i* plot.scale), plot.h_center.x-y_res* plot.scale);
            ctx.beginPath();
            ctx.strokeStyle = color
            ctx.arc(pos.x, pos.y, 1, 0, 2 * Math.PI, false);
            ctx.stroke();
        } catch(err)
        {
            console.log(err)
            continue;
        }
    }
}

export default {drawFunc}