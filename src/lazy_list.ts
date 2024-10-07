const template = document.createElement("template");
template.innerHTML = `
<style>
#list {
  height: var(--height);
  width: var(--width);  
  border: var(--border);
  padding: var(--padding);
  overflow: scroll;
  scrollbar-width: none;
}
#spacer-top {
  width: 100%;
  height: 0px;
}
#spacer-bottom {
  width: 100%;
  height: 1000px;
}
</style>
<div id="list">
  <div id="spacer-top"></div>
  <slot></slot>
  <div id="spacer-bottom"></div>
</div>
`;

export type Renderer<T> = (item: T) => HTMLElement;

export class LazyList<T> extends HTMLElement {
  // By default, the list renders the items as div-s with strings in them.
  #renderFunction: Renderer<T> = (item) => {
    const element = document.createElement("div");
    element.innerText = JSON.stringify(item);
    return element;
  };

  // These could be useful properties to consider, but not mandatory to use.
  // Similarly, feel free to edit the shadow DOM template in any way you want.

  // By default, the list is empty.
  #data: T[] = [];

  // The index of the first visible data item.
  #visiblePosition: number = 0;
  #toShow: number = 20;

  // The amount of space that needs to be shown before the first visible item.
  #topOffsetElement: HTMLElement;
  // The amount of space that needs to be shown after the last visible item.
  #bottomOffsetElement: HTMLElement;
  #elementHeight: number = 350;

  // The container that stores the spacer elements and the slot where items are inserted.
  #listElement: HTMLElement;

  static register() {
    customElements.define("lazy-list", LazyList);
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#topOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-top")!;
    this.#bottomOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-bottom")!;
    this.#listElement = this.shadowRoot.querySelector<HTMLElement>("#list")!;

    this.#listElement.onscroll = () => this.#onScroll();  
  }

  #onScroll() {
    const visiblePosition = Math.floor(this.#listElement.scrollTop / this.#elementHeight);
    if (visiblePosition !== this.#visiblePosition) {
      this.#visiblePosition = visiblePosition;
      this.#render();
    }
  }

  #render() {
    const endPosition = Math.min(this.#visiblePosition + this.#toShow, this.#data.length);

    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }

    for (let i = this.#visiblePosition; i < endPosition; i++) {
      this.appendChild(this.#renderFunction(this.#data[i]));
    }
    this.#topOffsetElement.style.height = `${this.#visiblePosition * this.#elementHeight}px`;
    this.#bottomOffsetElement.style.height = `${(this.#data.length - (this.#visiblePosition + this.#toShow)) * this.#elementHeight}px`;
  }

  setData(data: T[]) {
    this.#data = data;
    this.#onScroll();
    this.#render();
  }

  setRenderer(renderer: Renderer<T>) {
    this.#renderFunction = renderer;
    this.#render();
  }
}
