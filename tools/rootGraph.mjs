import CanvasManager from "./CanvasManager.mjs";
import Vector2D from "./Vector2D.mjs";

const isFloat = (str_n) => {
    return parseFloat(str_n) !== parseInt(str_n)
}

/**
 * Afficher un repere, chaque pas [x, y]_step correspond a 1px.
 * @param {CanvasManager} cm Le contexte
 * @param {Vector2D} dim_x Limite a gauche et a droite de l'axe horizontal 
 * @param {Vector2D} dim_y Limite en haut et en bas de l'axe vertical  
 * @param {float} x_step Pas de l'axe x (+1, +0.5, n/T, etc.)  
 * @param {float} y_step Pas de l'axe y  (+1, +0.5, n/T, etc.)  
 */
function showRootReal(cm, scale=5, y_tag="f(x)", x_tag=" x ", dim_x=new Vector2D(-10,10), dim_y=new Vector2D(10,-10), x_step=1, y_step=1)
{
    const ctx = cm.getCtx();
    const canvas = cm.getCanvas()

    const axes_config = {
        h_center: new Vector2D(canvas.width/2, 0),
        v_center: new Vector2D(0, canvas.height/2),
        max_y_pos: new Vector2D(cm.center.x, cm.center.y-(scale*dim_y.x)),
        max_x_pos: new Vector2D(cm.center.x+(scale*dim_x.y), cm.center.y),
        min_y_pos: new Vector2D(cm.center.x, cm.center.y-(scale*dim_y.y)),
        min_x_pos: new Vector2D(cm.center.x+(scale*dim_x.x), cm.center.y),
        dim_x,
        dim_y,
        scale
    }
        
    //x
    cm.createLine(cm.center, axes_config.max_x_pos, "black")
    cm.createLine(cm.center, axes_config.min_x_pos, "black")

    // // graduation
    for (
        let i = dim_x.x, pos = axes_config.min_x_pos;  
        i <= dim_x.y; 
        i+=x_step, pos = pos.add(new Vector2D(x_step*scale, 0))
    ) {
        if (scale >= 40)
        {
            ctx.fillStyle = "black"
            ctx.font = `${10}px 'Courier New'`;
            if(isFloat(i))
            {
                ctx.fillText(i.toFixed(2), pos.x-10, pos.y+20);
            } else
            {
                ctx.fillText(i, pos.x-3.9, pos.y+20);
            }
            
        }

        if(isFloat(i))
        {
            cm.createLine(pos.add(new Vector2D(0, +3)), pos.add(new Vector2D(0, -3)), "black")
        } else
        {
            cm.createLine(pos.add(new Vector2D(0, +3)), pos.add(new Vector2D(0, -3)), "black")
        }
    }

    ctx.fillStyle = "red"
    ctx.font = "20px 'Courier New'";
    ctx.fillText(x_tag, canvas.width-40, axes_config.v_center.y+40);
    
    //y
    cm.createLine(cm.center, axes_config.max_y_pos, "black")
    cm.createLine(cm.center, axes_config.min_y_pos, "black")

    // // graduation
    for (
        let i = dim_y.x, pos = axes_config.max_y_pos;  
        i >= dim_y.y; 
        i-=y_step, pos = pos.add(new Vector2D(0, y_step*scale))
    ) {
        if (scale >= 40)
        {
            ctx.fillStyle = "black"
            ctx.font = "10px 'Courier New'";

            if(isFloat(i))
            {
                ctx.fillText(i.toFixed(2), pos.x+10, pos.y+3.9);
            } else
            {
                ctx.fillText(i, pos.x+10, pos.y+3.9);
            }
        }

        cm.createLine(pos.add(new Vector2D(-3, 0)), pos.add(new Vector2D(+3, 0)), "black")
    }

    ctx.fillStyle = "red"
    ctx.font = "20px 'Courier New'";
    ctx.fillText(y_tag, axes_config.h_center.x+50, 40);

    return axes_config;
}

export default {showRootReal}