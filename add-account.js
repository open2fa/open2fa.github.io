import { BaseElement } from "./base-element.js";
import { database, ErrorInvalidAccount } from "./database.js";

export class AddAccount extends BaseElement {
	constructor() {
		super("add-account");
		this.$confirmButton.addEventListener("click", this);
		this.$dialog.addEventListener("close", this);
		this.$secretInput.addEventListener("input", this);
		this.$openDialogButton.addEventListener("click", this);
	}

	get $confirmButton() {
		return this.getElement('button[value="confirm"]');
	}

	get $dialog() {
		return this.getElement("dialog");
	}

	get $nameInput() {
		return this.getElement("input#name");
	}

	get $oneTimePassord() {
		return this.getElement("one-time-password");
	}

	get $openDialogButton() {
		return this.getElement(":host>button");
	}

	get $secretInput() {
		return this.getElement("input#secret");
	}

	handleEvent(event) {
		if (event.type === "click") {
			if (event.target === this.$confirmButton) {
				event.preventDefault();
				const account = {
					name: this.$nameInput.value,
					secret: this.$secretInput.secret,
				};
				try {
					database.addAccount(account);
					this.$dialog.close();
				} catch (error) {
					if (error instanceof ErrorInvalidAccount) {
						// TODO get info from error, highlight input fields.
						return;
					}
					console.error(error);
				}
			}

			if (event.target === this.$openDialogButton) {
				this.$dialog.showModal();
			}
		}

		if (event.type === "close") {
			// TODO use returnValue (see MDN)
			console.log(this.$dialog.returnValue);
			// Cleanup.
			this.$nameInput.value = "";
			this.$secretInput.value = "";
			this.$oneTimePassord.secret = "";
		}

		if (event.type === "input") {
			if (event.target === this.$secretInput) {
				this.$oneTimePassord.secret = this.$secretInput.value;
			}
		}
	}
}
