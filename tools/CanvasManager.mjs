import Vector2D from "./Vector2D.mjs";

export default class CanvasManager
{
    constructor()
    {
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas = document.getElementById("canvas");
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.canvas.getContext("2d")
        this.center = new Vector2D(this.canvas.width/2, this.canvas.height/2);
    }

    toCanvasBase(vec)
    {
        return this.center.add(vec);
    }

    canvasTakeCoffee()
    {
        this.ctx.fillStyle = "black"
        this.ctx.font = "30px 'Courier New'";
        this.ctx.fillText("⏸", this.canvas.width-60, 60);
    }
    
    /**
    * 
    * @param {CanvasRenderingContext2D} ctx 
    * @param {Vector2D} from 
    * @param {Vector2D} to 
    * @param {*} w 
    */
    createLine(from, to, color="black", dotted=false)
    {
        this.ctx.strokeStyle = color
        
        if(dotted)
        {
            this.ctx.setLineDash([5, 7]);
        }

        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y)
        this.ctx.stroke()
        this.ctx.strokeStyle = "transparent"

        if(dotted)
        {
            this.ctx.setLineDash([]);
        }
    }

    createDot(pos, radius=1, start_angle=0, end_angle=2*Math.PI, color="black", counter_clockwise=false, fill=false)
    {
        if (!fill)
        {
            this.ctx.strokeStyle = color
        } else
        {
            this.ctx.fillStyle = color
        }

        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, start_angle, end_angle, counter_clockwise);

        if(!fill)
        {
            this.ctx.stroke();
            this.ctx.strokeStyle = "transparent"
        } else
        {
            this.ctx.fill();
            this.ctx.fillStyle = "transparent"
        }
    }

    /**
    * @return {HTMLCanvasElement}
    */
    getCanvas()
    {
        return this.canvas;
    }

    /**
    * @return {CanvasRenderingContext2D}
    */
    getCtx()
    {
        return this.ctx;
    }

    clearCtx()
    {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }
}