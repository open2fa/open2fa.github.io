export class BaseElement extends HTMLElement {
  constructor(templateId) {
    super().attachShadow({ mode: "open" });
    const template = document.querySelector(`template#${templateId}`);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  getElement(selector) {
    return this.shadowRoot.querySelector(selector);
  }
}
