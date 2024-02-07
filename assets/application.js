class CollapsibleContent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <slot></slot>
      `;
    }
}

class CollapsibleButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <slot></slot>
      `;
    }

    connectedCallback() {
        this.addEventListener("click", () => this.handleClick());
        if (this.getAttribute('close-on-click')) document.addEventListener("click", (event) => this.handleDocumentClick(event));
    }

    disconnectedCallback() {
        this.removeEventListener("click", () => this.handleClick());
        if (this.getAttribute('close-on-click')) document.removeEventListener("click", (event) => this.handleDocumentClick(event));
    }

    handleClick() {
        const targetId = this.getAttribute('target-id');
        const content = document.querySelector(`[data-id="${targetId}"]`);
        if (content) {
            content.classList.toggle('en-active');
            this.classList.toggle('en-opened');
        }
    }

    handleDocumentClick(event) {
        const isInsideButton = this.contains(event.target);
        if (!isInsideButton) {
            const targetId = this.getAttribute('target-id');
            const content = document.querySelector(`[data-id="${targetId}"]`);
            if (content && content.classList.contains('en-active')) {
                content.classList.remove('en-active');
                this.classList.remove('en-opened');
            }
        }
    }
}

customElements.define('collapsible-content', CollapsibleContent);
customElements.define('collapsible-button', CollapsibleButton);



class RemoveFilter extends HTMLElement {
    constructor() {
        super();
        this.url = this.getAttribute('data-url');
    }

    connectedCallback() {
        this.addEventListener("click", () => this.handleClick());
    }
    disconnectedCallback() {
        this.addEventListener("click", () => this.handleClick());
    }




    handleClick() {
        this.productsOverlayGrid = document.querySelector('#products-grid-overlay');
        this.productsGrid = document.querySelector('#products-grid');
        this.productsOverlayGrid.classList.add('bg-[rgba(var(--color-bg))]', 'z-[101]');
        this.filterComponent = document.querySelector('#en-filters');
        fetch(this.url)
            .then((response) => response.text())
            .then((data) => {
                const html = new DOMParser().parseFromString(data, 'text/html');
                this.productsGrid.innerHTML = html.getElementById('products-grid').innerHTML;
                this.filterComponent.innerHTML = html.getElementById('en-filters').innerHTML;
                window.history.replaceState({}, '', this.url);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                document.querySelector('#products-grid-overlay').classList.remove('bg-[rgba(var(--color-bg))]', 'z-[101]');
            });
    }
}

customElements.define('remove-filter', RemoveFilter);

class FilterForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
          <slot></slot>
        `;
        this.inputs = this.querySelectorAll('input, select');

        this.handleFormChange = this.handleFormChange.bind(this);
        this.setupEventListeners();
    }

    connectedCallback() {
        this.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFormChange();
        });
    }

    setupEventListeners() {
        this.inputs.forEach((input) => {
            input.addEventListener('change', this.handleFormChange);
        });
    }

    handleFormChange() {
        this.productsGrid = document.querySelector('#products-grid');
        this.filterComponent = document.querySelector('#active-filters');
        const formData = new FormData(this.querySelector('form'));
        const formString = new URLSearchParams(formData).toString();
        const url = `${window.location.pathname}?${formString}`;
        document.querySelector('#products-grid-overlay').classList.add('bg-[rgba(var(--color-bg))]', 'z-[101]');
        fetch(url)
            .then((response) => response.text())
            .then((data) => {
                const html = new DOMParser().parseFromString(data, 'text/html');
                this.productsGrid.innerHTML = html.getElementById('products-grid').innerHTML;
                this.filterComponent.innerHTML = html.getElementById('active-filters').innerHTML;
                this.updateURL(`${window.location.pathname}?${formString}`);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                document.querySelector('#products-grid-overlay').classList.remove('bg-[rgba(var(--color-bg))]', 'z-[101]');
            });
    }

    updateURL(url) {
        window.history.replaceState({}, '', url);
    }
}

customElements.define('filter-form', FilterForm);


class PriceRange extends HTMLElement {
    constructor() {
        super();
        this.range1 = this.querySelector('#range1');
        this.range2 = this.querySelector('#range2');
        this.slider1 = this.querySelector('#slider-1');
        this.slider2 = this.querySelector('#slider-2');
    }


    connectedCallback() {
        this.slider1.addEventListener('input', () => this.changeRange1());
        this.slider2.addEventListener('input', () => this.changeRange2());
        this.range1.addEventListener('input', () => this.changeSlide1());
        this.range2.addEventListener('input', () => this.changeSlide2());
    }
    disconnectedCallback() {
        this.slider1.removeEventListener('input', () => this.changeRange1());
        this.slider2.removeEventListener('input', () => this.changeRange2());
        this.range1.removeEventListener('input', () => this.changeSlide1());
        this.range2.removeEventListener('input', () => this.changeSlide2());
    }


    changeSlide1() {
        if (this.range1.value <= parseInt(this.range2.value)) {
            this.slider1.value = parseInt(this.range1.value);
        } else {
            this.range1.value = parseInt(this.range2.value) - 1;
        }
    }

    changeSlide2() {
        if (parseInt(this.range2.value) > this.range1.value) {
            this.slider2.value = parseInt(this.range2.value);
        } else {
            this.range2.value = parseInt(this.range1.value) + 1;
        }
    }

    changeRange1() {
        if (parseInt(this.slider1.value) <= parseInt(this.slider2.value)) {
            this.range1.value = parseInt(this.slider1.value);
        } else {
            this.slider1.value = parseInt(this.slider2.value) - 1;
        }
    }

    changeRange2() {
        if (parseInt(this.slider2.value) > parseInt(this.slider1.value)) {
            this.range2.value = parseInt(this.slider2.value);
        } else {
            this.slider2.value = parseInt(this.slider1.value) + 1;
        }
    }
}

customElements.define('price-range', PriceRange);



class ModelViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
          <slot></slot>
        `;

        this.closeButton = this.querySelector("#model-close")
        this.openButton = this.querySelector("#model-open")
        this.model = this.querySelector("model-viewer")
        this.modelOverlay = this.querySelector("#model-overlay");



    }


    connectedCallback() {
        this.closeButton.addEventListener("click", () => this.closeModel())
        this.openButton.addEventListener("click", () => this.openModel())
    }

    disconnectedCallback() {
        this.closeButton.removeEventListener("click", () => this.closeModel())
        this.openButton.removeEventListener("click", () => this.openModel())
    }

    openModel() {
        this.model.style.pointerEvents = "all"
        this.openButton.classList.add("hidden")
        this.closeButton.classList.remove("hidden")
        this.modelOverlay.classList.add("hidden");
    }


    closeModel() {
        this.model.style.pointerEvents = "none";
        this.closeButton.classList.add("hidden");
        this.openButton.classList.remove("hidden")
        this.modelOverlay.classList.remove("hidden");
    }
}

customElements.define("en-model-viewer", ModelViewer)


class VariantSelector extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('change', this.onVariantChange);
    }


    onVariantChange(event) {
        this.updateOptions();
        this.updateMasterId();
        this.updateSelectedSwatchValue(event);
        this.toggleAddButton(true, '', false);

        this.updateVariantStatuses();



        console.log(this.currentVariant)
        if (!this.currentVariant) {
            this.setUnavailable();
            console.log('---unav---')
        } else {
            this.updateVariantInput();
            console.log('---av---')
        }


        // this.disableButtons();
        // this.getSelectedOptions();

        // this.getSelectedVariant();

        // if (this.currentVariant) {
        //     const quickAddModal = this.closest('quick-add-modal');
        //     if (!quickAddModal) {
        //         this.updateURL();
        //     }
        //     this.updateFormID();
        //     this.updatePrice();
        //     this.updateSKU();
        // } else {

        // }

        // const variantChangeEvent = new CustomEvent('variantChange', {

        //     detail: {
        //         variantId: this.currentVariant.id,
        //         imageId: this.currentVariant.featured_media.id,
        //     },
        // });
        // document.dispatchEvent(variantChangeEvent);

    }

    updateOptions() {
        this.options = Array.from(this.querySelectorAll('select, fieldset'), (element) => {
            if (element.tagName === 'SELECT') {
                return element.value;
            }
            if (element.tagName === 'FIELDSET') {
                return Array.from(element.querySelectorAll('input')).find((radio) => radio.checked)?.value;
            }
        });
    }

    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
            return !variant.options
                .map((option, index) => {
                    return this.options[index] === option;
                })
                .includes(false);
        });
    }

    updateSelectedSwatchValue({ target }) {
        const { name, value, tagName } = target;

        if (tagName === 'SELECT' && target.selectedOptions.length) {
            const swatchValue = target.selectedOptions[0].dataset.optionSwatchValue;
            const selectedDropdownSwatchValue = this.querySelector(`[data-selected-dropdown-swatch="${name}"] > .swatch`);
            if (!selectedDropdownSwatchValue) return;
            if (swatchValue) {
                selectedDropdownSwatchValue.style.setProperty('--swatch--background', swatchValue);
                selectedDropdownSwatchValue.classList.remove('swatch--unavailable');
            } else {
                selectedDropdownSwatchValue.style.setProperty('--swatch--background', 'unset');
                selectedDropdownSwatchValue.classList.add('swatch--unavailable');
            }
        } else if (tagName === 'INPUT' && target.type === 'radio') {
            const selectedSwatchValue = this.querySelector(`[data-selected-swatch-value="${name}"]`);
            if (selectedSwatchValue) selectedSwatchValue.innerHTML = value;
        }
    }

    updateVariantInput() {
        const productForms = document.querySelectorAll(
            `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
        );

        productForms.forEach((productForm) => {
            const input = productForm.querySelector('input[name="id"]');
            input.value = this.currentVariant.id;
            console.log(input, "-----input-----")
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    updateVariantStatuses() {
        const selectedOptionOneVariants = this.variantData.filter(
            (variant) => this.querySelector(':checked').value === variant.option1
        );
        const inputWrappers = [...this.querySelectorAll('.product-form__input')];
        inputWrappers.forEach((option, index) => {
            if (index === 0) return;
            const optionInputs = [...option.querySelectorAll('input[type="radio"], option')];
            const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
            const availableOptionInputsValue = selectedOptionOneVariants
                .filter((variant) => variant.available && variant[`option${index}`] === previousOptionSelected)
                .map((variantOption) => variantOption[`option${index + 1}`]);
            this.setInputAvailability(optionInputs, availableOptionInputsValue);
        });
    }

    setInputAvailability(elementList, availableValuesList) {
        console.log(elementList)
        console.log(availableValuesList)
        elementList.forEach((element) => {
            const value = element.getAttribute('value');
            const availableElement = availableValuesList.includes(value);

            if (element.tagName === 'INPUT') {
                element.classList.toggle('disabled', !availableElement);
                element.parentNode.classList.toggle('not-available', !availableElement)
            } else if (element.tagName === 'OPTION') {
                element.innerText = availableElement
                    ? value
                    : window.variantStrings.unavailable_with_option.replace('[value]', value);
            }
        });
    }

    toggleAddButton(disable = true, text, modifyClass = true) {
        const productForm = document.getElementById(`product-form-${this.dataset.section}`);
        if (!productForm) return;
        const addButton = productForm.querySelector('[name="add"]');
        const addButtonText = productForm.querySelector('[name="add"] > span');
        console.log(addButton, '---addbutton---')
        if (!addButton) return;

        if (disable) {
            addButton.setAttribute('disabled', 'disabled');
            if (text) addButtonText.textContent = text;
        } else {
            addButton.removeAttribute('disabled');
            addButtonText.textContent = window.variantStrings.addToCart;
        }

        if (!modifyClass) return;
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
        return this.variantData;
    }

    setUnavailable() {
        const button = document.getElementById(`product-form-${this.dataset.section}`);
        const addButton = button.querySelector('[name="add"]');
        const addButtonText = button.querySelector('[name="add"] > span');
        const price = document.getElementById(`price-${this.dataset.section}`);
        const inventory = document.getElementById(`Inventory-${this.dataset.section}`);
        const sku = document.getElementById(`Sku-${this.dataset.section}`);
        const pricePerItem = document.getElementById(`Price-Per-Item-${this.dataset.section}`);
        const volumeNote = document.getElementById(`Volume-Note-${this.dataset.section}`);
        const volumeTable = document.getElementById(`Volume-${this.dataset.section}`);
        const qtyRules = document.getElementById(`Quantity-Rules-${this.dataset.section}`);

        if (!addButton) return;
        addButtonText.textContent = window.variantStrings.unavailable;
        if (price) price.classList.add('hidden');
        if (inventory) inventory.classList.add('hidden');
        if (sku) sku.classList.add('hidden');
        if (pricePerItem) pricePerItem.classList.add('hidden');
        if (volumeNote) volumeNote.classList.add('hidden');
        if (volumeTable) volumeTable.classList.add('hidden');
        if (qtyRules) qtyRules.classList.add('hidden');
    }



    // disableButtons() {
    //     let buttons = document.querySelector("product-form").querySelectorAll('button')
    //     if (!buttons) return
    //     buttons.forEach((button) => {
    //         button.disabled = true
    //     })
    // }

    // getSelectedOptions() {
    //     this.options = Array.from(this.querySelectorAll('input[type="radio"]:checked'), (input) => input.value);
    // }

    // getVariantJSON() {
    //     this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    //     return this.variantData;
    // }

    // getVariantData() {
    //     this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    //     return this.variantData;
    // }

    // getSelectedVariant() {
    //     this.currentVariant = this.getVariantJSON().find((variant) => {
    //         const findings = !variant.options
    //             .map((option, index) => {
    //                 return this.options[index] === option;
    //             })
    //             .includes(false);

    //         if (findings) return variant;
    //     });
    // }

    // updateURL() {
    //     if (!this.currentVariant) return;
    //     window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    // }

    // updateFormID() {
    //     console.log(this.dataset.section)
    //     const form_input = document.querySelector(`#product-form-${this.dataset.section}`).querySelector('input[name="id"]');
    //     form_input.value = this.currentVariant.id;
    // }

    // updateSKU() {
    //     const sku = document.querySelector('.sku--text');
    //     sku.textContent = this.currentVariant.sku;
    // }

    // updatePrice() {
    //     fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
    //         .then((response) => response.text())
    //         .then((responseText) => {
    //             const priceId = `price-${this.dataset.section}`;
    //             const html = new DOMParser().parseFromString(responseText, 'text/html');

    //             const oldPrice = document.getElementById(priceId);
    //             const newPrice = html.getElementById(priceId);

    //             if (oldPrice && newPrice) oldPrice.innerHTML = newPrice.innerHTML;



    //             const buttonsId = `buttons-${this.dataset.section}`;
    //             const newButtons = html.getElementById(buttonsId);
    //             const oldButtons = document.getElementById(buttonsId);


    //             if (oldButtons && newButtons) oldButtons.innerHTML = newButtons.innerHTML;

    //             if (window.Shopify && Shopify.PaymentButton) {
    //                 Shopify.PaymentButton.init();
    //             }
    //         });
    // }


}

customElements.define('variant-selector', VariantSelector);




class AddtoCartButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener("click", () => this.handleAddtoCart());
    }

    disconnectedCallback() {
        this.removeEventListener("click", () => this.handleAddtoCart());
    }

    handleAddtoCart() {
        const form = document.querySelector('#product-form'); // Replace with your form selector
        this.innerHTML = "Adding..."

        fetch("/cart/add", {
            method: "post",
            body: new FormData(form),
        })
            .then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html');
                const mainNav = document.getElementById("main-nav");
                const newMainNavContent = html.getElementById("main-nav").innerHTML;
                mainNav.innerHTML = newMainNavContent;
                document.querySelector('open-drawer[data-drawer="cart-drawer"]').click();
            })
            .catch((error) => {
                console.error("An error occurred:", error);
                // Handle error gracefully, e.g., show an error message
            })
            .finally(() => {
                this.innerHTML = "Add to Cart";
            });
    }
}

customElements.define("add-to-cart", AddtoCartButton);


class ProductForm extends HTMLElement {
    constructor() {
        super()
        this.form = this.querySelector("form");
        this.button = this.querySelector('[type="submit"]');
        this.type = this.getAttribute("data-type")
    }

    connectedCallback() {
        if (this.form && this.button) this.button.addEventListener("click", (e) => this.addToCart(e))

    }

    disconnectedCallback() {
        if (this.form && this.button) this.button.removeEventListener("click", (e) => this.addToCart(e))

    }

    addToCart(e) {
        e.preventDefault()

        this.form = this.querySelector("form");
        this.querySelector(".spinner--overlay").classList.remove("hidden")
        if (this.type == 'quick-add') {
            this.querySelector(".icon-plus").classList.add("hidden")


        }

        this.querySelectorAll("button").forEach((button) => {
            button.disabled = true;
        })

        fetch("/cart/add", {
            method: "post",
            body: new FormData(this.form),
        })
            .then((response) => response.text())
            .then((responseText) => {
                const html = new DOMParser().parseFromString(responseText, 'text/html');
                const mainNav = document.getElementById("main-nav");
                const newMainNavContent = html.getElementById("main-nav").innerHTML;
                mainNav.innerHTML = newMainNavContent;
                const cartButton = document.querySelector('open-drawer[data-drawer="cart-drawer" ]');
                if (cartButton) {
                    cartButton.click()
                }
            })
            .catch((error) => {
                console.error("An error occurred:", error);
            })
            .finally(() => {
                if (this.type == 'quick-add') {
                    this.querySelector(".icon-plus").classList.remove("hidden")


                }
                this.querySelectorAll("button").forEach((button) => {
                    button.disabled = false;
                })

                this.querySelector(".spinner--overlay").classList.add("hidden")

            });

    }

}

customElements.define("product-form", ProductForm)


class QuickAdd extends HTMLElement {
    constructor() {
        super()
    }


    connectedCallback() {
        this.addEventListener("click", (event) => this.handleClick(event))
    }

    disconnectedCallback() {
        this.removeEventListener("click", (event) => this.handleClick(event))
    }

    handleClick(event) {

        if (event.target.classList.contains("fixed") || event.target.classList.contains("close-modal")) {
            this.classList.toggle("hidden")
            document.body.classList.remove('overflow-hidden');
        }


    }

}

customElements.define("quick-add-modal", QuickAdd)


class QuickAddOpener extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener("click", () => this.openQuickAdd(this));
    }

    disconnectedCallback() {
        this.removeEventListener("click", () => this.openQuickAdd(this));
    }

    openQuickAdd = (opener) => {
        this.querySelector(".spinner--overlay").classList.remove("hidden")
        this.querySelector(".icon-link").classList.add("hidden")


        this.targetId = this.getAttribute("target-quickadd-id");
        this.drawer = document.querySelector(`[quickadd-id="${this.targetId}"]`);
        if (this.drawer) {
            fetch(opener.getAttribute('data-product-url'))
                .then((response) => response.text())
                .then((responseText) => {
                    const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
                    const productElement = responseHTML.querySelector('[id^="MainProduct-"]');
                    console.log(responseHTML)
                    let id = "QuickAddInfo-" + opener.getAttribute('data-id').replace(" ", "");
                    const targetElement = document.getElementById(id);
                    targetElement.innerHTML = productElement.innerHTML;

                    // Reinjects the script tags to allow execution.
                    targetElement.querySelectorAll('script').forEach((oldScriptTag) => {
                        const newScriptTag = document.createElement('script');
                        Array.from(oldScriptTag.attributes).forEach((attribute) => {
                            newScriptTag.setAttribute(attribute.name, attribute.value);
                        });
                        newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
                        oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
                    });

                    if (window.Shopify && Shopify.PaymentButton) {
                        Shopify.PaymentButton.init();
                    }
                })
                .finally(() => {
                    this.drawer.classList.remove("hidden");
                    this.querySelector(".spinner--overlay").classList.add("hidden")
                    this.querySelector(".icon-link").classList.remove("hidden")
                    document.body.classList.add('overflow-hidden')
                });
        }
    }
}

customElements.define("quick-add-opener", QuickAddOpener);


class SliderComponent extends HTMLElement {
    constructor() {
        super();
        // Parse the JSON string from the data-slider attribute
        try {
            this.sliderData = JSON.parse(this.getAttribute("data-slider")) || {};
            console.log(this.sliderData)
        } catch (error) {
            console.error("Error parsing data-slider attribute:", error);
            this.sliderData = {};
        }
    }

    connectedCallback() {
        this.sliderElement = this.querySelector(".main-carousel");

        if (!this.sliderElement) {
            // console.error("Slider element not found. Make sure you have an element with class 'main-carousel'");
            return;
        }

        // Merge user-defined options with default options
        const flickityOptions = {
            cellAlign: 'center',
            contain: true,
            pageDots: true,
            wrapAround: false,
            prevNextButtons: false,
            draggable: true,
            ...this.sliderData.options,
        };

        const responsive = { ... this.sliderData.responsive }

        this.flickity = new Flickity(this.sliderElement, flickityOptions);

        this.thumbnailsElement = this.querySelector(".carousel-thumbnails");

        if (this.thumbnailsElement) {
            const thumbnailOptions = {
                asNavFor: '.main-carousel',
                pageDots: false,
                contain: true,
                prevNextButtons: false,
                ...this.sliderData.thumbnailOptions,
            };

            this.flickity1 = new Flickity(this.thumbnailsElement, thumbnailOptions);
        }
    }

    disconnectedCallback() {
        // Clean up resources if needed
        if (this.flickity) {
            this.flickity.destroy();
        }

        if (this.flickity1) {
            this.flickity1.destroy();
        }
    }
}

customElements.define("slider-component", SliderComponent);





class EnHeader extends HTMLElement {
    constructor() {
        super();
        this.headerType = this.getAttribute("data-headertype");
        this.announcementBarHeight = this.calculateAnnouncementBarHeight(); // New line
        this.headerHeight = this.offsetHeight;
        this.prevScrollpos = window.scrollY;

        if (this.headerType === "sticky") {
            this.stickyHeader.bind(this)();
        } else if (this.headerType === "hideonscroll") {
            this.hideOnScroll.bind(this)();
        }

        window.matchMedia('(max-width: 1024px)').addEventListener('change', this.setHeaderHeight.bind(this));
        document.documentElement.style.setProperty('--header-height', `${this.headerHeight}px`);
    }

    calculateAnnouncementBarHeight() {
        const announcementBar = document.querySelector(".announcement-bar"); // Adjust the selector
        return announcementBar ? announcementBar.offsetHeight : 0;
    }

    setHeaderHeight() {
        this.headerHeight = this.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${this.headerHeight}px`);
    }

    stickyHeader() {
        // Your code for making the header sticky goes here
    }

    hideOnScroll() {
        window.onscroll = () => {
            const currentScrollPos = window.scrollY;
            const scrollDirection = currentScrollPos > this.prevScrollpos ? 'down' : 'up';

            if (scrollDirection === 'up' || currentScrollPos < this.announcementBarHeight) {
                this.style.top = "0";
            } else {
                this.style.top = `-${this.headerHeight}px`;
            }

            this.prevScrollpos = currentScrollPos;
        };
    }
}

customElements.define("en-header", EnHeader);







customElements.define('en-drawer', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener("click", () => this.handleClick)
    }

    disconnectedCallback() {
        this.removeEventListener("click", () => this.handleClick)
    }

    handleClick() {
    }
});

customElements.define('open-drawer', class extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', this.openDrawer.bind(this));
    }

    openDrawer() {
        const drawerId = this.getAttribute('data-drawer');
        const drawer = document.querySelector(`en-drawer[data-id="${drawerId}"]`);
        if (drawer) {
            drawer.setAttribute("expanded", '')
            drawer.classList.add("visible")
            drawer.addEventListener("click", (e) => {
                if (e.target.classList.contains("overlay-full") || e.target.classList.contains("drawer-close") || e.target.classList.contains("close-drawer")) {
                    drawer.removeAttribute("expanded")
                    drawer.classList.remove("visible")

                }
            })
        }
    }
});


class DropdownMenu extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("mouseenter", () => {
            this.id = this.getAttribute("data-id");
            this.target = this.nextElementSibling;
            this.target.classList.remove("scale-y-0")
        })

        this.addEventListener("mouseleave", () => {
            this.id = this.getAttribute("data-id");
            this.target = this.nextElementSibling;
            this.target.classList.add("scale-y-0")
        })
    }
}


customElements.define("dropdown-menu", DropdownMenu)


class SplideComponent extends HTMLElement {
    constructor() {
        super();
        try {
            this.splideData = JSON.parse(this.getAttribute("data-splide")) || {};
        } catch (error) {
            console.error("Error parsing data-splide attribute:", error);
            this.splideData = {};
        }

        this.sliderType = this.getAttribute('data-type');
        this.animation = this.getAttribute('data-animation')
    }

    connectedCallback() {
        this.splideElement = this.querySelector(".splide");

        if (!this.splideElement) {
            return;
        }

        const splideOptions = {
            type: 'slide',
            rewind: false,
            ...this.splideData,
        };

        this.main = new Splide(this.splideElement, splideOptions);

        this.main.on('mounted', () => {
            console.log("Splide mounted");
            document.addEventListener('variantChange', this.onVariantChange.bind(this));
        });

        this.thumbnailsElement = this.querySelector(".splide-thumbnails");

        if (this.thumbnailsElement) {
            try {
                this.thumbnailsData = JSON.parse(this.getAttribute("data-thumbnails")) || {};
            } catch (error) {
                console.error("Error parsing data-splide attribute:", error);
                this.thumbnailsData = {};
            }

            const thumbnailOptions = {
                isNavigation: true,
                ...this.thumbnailsData,
            };

            console.log(thumbnailOptions)
            this.thumbnails = new Splide(this.thumbnailsElement, thumbnailOptions);

            this.main.sync(this.thumbnails);

            this.main.mount();
            this.thumbnails.mount();

        } else {
            this.main.mount();
        }

        if (this.animation) {
            this.handleAnimation(this.main)
        }
    }

    disconnectedCallback() {
        if (this.main) {
            this.main.destroy();
            if (this.thumbnails) {
                this.thumbnails.destroy();
            }
        }
    }

    onVariantChange(event) {
        const imageId = event.detail.imageId;

        console.log(imageId, "___image");

        const slideIndex = Array.from(this.splideElement.querySelectorAll('.splide__slide')).findIndex(
            (slide) => slide.getAttribute('data-imageid') === imageId.toString()
        );

        console.log(slideIndex);

        if (slideIndex !== -1) {
            this.main.go(slideIndex);
        } else {
            console.log("No variants found");
        }
    }
    handleAnimation(splide) {
        splide.on('active', (e) => {
            const activeSlide = splide.Components.Elements.slides[e.index];
            const titles = activeSlide.querySelectorAll('.animate');
            titles.forEach((title) => {
                title.classList.add('animate__fadeInRight');
                title.classList.remove('animated');
            });
        });

        splide.on('inactive', (e) => {
            const activeSlide = splide.Components.Elements.slides[e.index];
            const titles = activeSlide.querySelectorAll('.animate');
            titles.forEach((title) => {
                title.classList.remove('animate__fadeInRight');
                title.classList.add('animated');
            });
        });
    }




}

customElements.define("splide-component", SplideComponent);






class ProductModel extends HTMLElement {
    constructor() {
        super();
        this.openModelModal();
        this.addEventListener('click', this.loadContent);
    }

    loadContent() {
        Shopify.loadFeatures(
            [
                {
                    name: 'model-viewer-ui',
                    version: '1.0',
                    onLoad: this.setupModelViewerUI.bind(this)
                }
            ]
        )
    }

    setupModelViewerUI(errors) {
        if (errors) return;
        this.modelViewerUI = new Shopify.ModelViewerUI(document.querySelector('model-viewer'))
    }

    getMediaID() {
        const id = this.getAttribute('data-media-id');
        return id;
    }

    getModal() {
        const modal = document.getElementById("productModelModal");
        return modal;
    }

    openModelModal() {
        const mediaID = this.getMediaID();
        const modal = this.getModal();

        if (!mediaID) return;

        const openModalButton = this.querySelector(`button[id="productModelOpenButton_${mediaID}"]`);

        openModalButton.addEventListener('click', function (e) {
            modal.querySelector("#body").innerHTML = "";

            const template = document.querySelector(`product-model[data-media-id="${mediaID}"] > template`);
            const clone = template.content.cloneNode(true);
            modal.querySelector("#body").appendChild(clone);
            modal.querySelector("#body > model-viewer").setAttribute("reveal", "auto");
        });
    }
}

const productModel = customElements.define('product-model', ProductModel);




const inputs = document.querySelectorAll('.form-control input');
const labels = document.querySelectorAll('.form-control label');

labels.forEach(label => {
    label.innerHTML = label.innerText
        .split('')
        .map((letter, idx) => `<span>${letter}</span>`)
        .join('');
});

window.addEventListener("beforeunload", function () {
    document.body.classList.add("animate-out");
});








document.addEventListener('shopify:section:load', () => {
    document.documentElement.style.setProperty('--header-height', `${document.querySelector("en-header").offsetHeight}px`);
});
