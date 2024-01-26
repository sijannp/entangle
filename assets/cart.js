



async function changeItemQuantity(key, quantity, section) {
    let target = document.getElementById(section)
    target.querySelector(`[data-key="${key}"] .plus`).disabled = true;
    target.querySelector(`[data-key="${key}"] .minus`).disabled = true;
    target.querySelector(`[data-key="${key}"] input`).disabled = true;
    target.querySelector(`[data-key="${key}"] .line-item-price`).classList.add("hidden");
    target.querySelector(`[data-key="${key}"] .spinner--overlay`).classList.remove("hidden");
    fetch("/cart/change.js", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: key,
            quantity,
        }),
    }).then(() => {

        fetch(`/cart?section_id=${section}`).then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html');
                if (section == 'cart-drawer') {
                    let elem = document.getElementById("cart-drawer")
                    elem.innerHTML = html.getElementById("cart-drawer").innerHTML
                } else {
                    let elem = document.getElementById("en-cart")
                    elem.innerHTML = html.getElementById("en-cart").innerHTML
                }
            }).finally(() => {
            });
    })
}


// Quantity Button Custom Element
class QuantityButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", this.onClick.bind(this));
        this.input = this.parentElement.querySelector("input");
        this.input.addEventListener("change", this.onClick.bind(this), this.getAttribute("data-section"))

    }

    onClick() {
        const input = this.parentElement.querySelector("input");
        let value = Number(input.value);
        const isPlus = this.classList.contains("plus");
        const key = this.closest(".cart-item").getAttribute("data-key");

        if (isPlus) {
            input.value = value + 1;
            changeItemQuantity(key, value + 1, this.getAttribute("data-section"));
        } else if (value > 1) {
            input.value = value - 1;
            changeItemQuantity(key, value - 1, this.getAttribute("data-section"));
        }
    }
}

// Remove from Cart Button Custom Element
class RemoveFromCartButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", this.onClick.bind(this));
    }

    onClick(event) {
        event.preventDefault();
        const key = this.closest(".cart-item").getAttribute("data-key");
        changeItemQuantity(key, 0, this.getAttribute("data-section"));
    }
}

// Define the custom elements
customElements.define("quantity-button", QuantityButton);
customElements.define("remove-from-cart", RemoveFromCartButton);
