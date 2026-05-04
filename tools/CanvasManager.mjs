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