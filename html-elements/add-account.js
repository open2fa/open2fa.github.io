import { BaseElement } from "../base-element.js"
import { database, ErrorInvalidAccount, ErrorAccountSecretAlreadyExists } from "../database.js"

export class AddAccount extends BaseElement {
  constructor() {
    super("add-account")
    this.$confirmButton.addEventListener("click", this)
    this.$dialog.addEventListener("close", this)
    this.$form.addEventListener("submit", this)
    this.$form.addEventListener("reset", this)
    this.$secretInput.addEventListener("input", this)
    this.$openDialogButton.addEventListener("click", this)
  }

  get $confirmButton() {
    return this.getElement('button[type="submit"]')
  }

  get $form() {
    return this.getElement("form")
  }

  get $dialog() {
    return this.getElement("dialog")
  }

  get $nameInput() {
    return this.getElement("input#name")
  }

  get $oneTimePassord() {
    return this.getElement("one-time-password")
  }

  get $openDialogButton() {
    return this.getElement(":host>button")
  }

  get $secretInput() {
    return this.getElement("input#secret")
  }

  cleanup() {
    this.$nameInput.value = ""
    this.$secretInput.value = ""
    this.$oneTimePassord.secret = ""
  }

  handleEvent(event) {
    if (event.type === "click") {
      if (event.target === this.$openDialogButton) {
        this.$dialog.showModal()
      }
    }

    if (event.type === "close") {
      this.cleanup()
    }

    if (event.type === "input") {
      if (event.target === this.$secretInput) {
        this.$oneTimePassord.secret = this.$secretInput.value
      }
    }

    if (event.type === "submit") {
      event.preventDefault()
      try {
        const account = {
          name: this.$nameInput.value,
          secret: this.$secretInput.value
        }
        database.addAccount(account)
        this.$dialog.close()
      } catch (error) {
        if (error instanceof ErrorInvalidAccount) return
        // TODO show feedback in UI
        if (error instanceof ErrorAccountSecretAlreadyExists) return
        console.error(error)
      }
    }

    if (event.type === "reset") {
      event.preventDefault()
      this.cleanup()
      this.$dialog.close()
    }
  }
}
