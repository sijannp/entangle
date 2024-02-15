class CartDrawer extends HTMLElement {
    constructor() {
        super();

    }

    connectedCallback() {
        document.addEventListener('openDrawer', this.openDrawer.bind(this))
    }

    disconnectedCallback() {
        document.removeEventListener('openDrawer', this.openDrawer.bind(this))
    }

    openDrawer() {

        this.setAttribute("expanded", '')
        this.classList.add("visible")

    }
}