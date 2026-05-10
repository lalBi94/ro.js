class Navbar extends HTMLElement
{
    connectedCallback()
    {
        this.innerHTML = `
            <nav>
                <div id="logo">
                    <p><span class="dyn-color">\\( \\rho \\)</span>.js</p>
                </div>
                
                <div>
                    <a href="">\\( f(x),\\frac{d}{dx}, \\int \\)</a>
                    |
                    <a href=""><span class="dyn-color">\\( \\mathcal{F} \\)</span>ourier</a>
                    |
                    <a href="">\\( e^{i{\\theta}}, Trigo \\)-Plane</a>
                    |
                    <a href="">\\( C \\)-Plane</a>
                </div>


                <ul id="ulinks">
                    <li>
                        <a href="">GitHub</a>
                    </li>

                    <li>
                        <a href="">Licence</a>
                    </li>

                    <li>
                        <button class="dyn-color-bg">Download \\( \\rho \\).js</button>
                    </li>
                </ul>
            </nav>
        `;
    }
}

customElements.define("nav-bar", Navbar)