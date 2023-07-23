import { BaseElement } from "../base-element.js";
import { database } from "../database.js";

export class AccountsList extends BaseElement {
  constructor() {
    super("accounts-list");
    this.updateNumAccounts();
  }
  get $numAccountsOutput() {
    return this.getElement("output#numAccounts");
  }
  updateNumAccounts() {
    this.$numAccountsOutput.textContent = database.numAccounts;
  }
}
