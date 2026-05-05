export default class Vector2D
{
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y)
    {
        this.x_val = x;
        this.y_val = y;
    }

    get x()
    {
        return this.x_val;
    }

    get y()
    {
        return this.y_val;
    }

    /**
     * 
     * @param {Vector2D} other 
     */
    add(other)
    {
        return new Vector2D((this.x_val + other.x), (this.y_val + other.y))
    }

    scalarProduct(other)
    {
        return new Vector2D((this.x_val * other.x), (this.y_val * other.y))
    }

    scale(k)
    {
        return new Vector2D(this.x_val*k, this.y_val*k)
    }

    dump()
    {
        return new Vector2D(this.x_val, this.y_val)
    }
}