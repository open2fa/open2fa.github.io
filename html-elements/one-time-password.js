import { BaseElement } from "../base-element.js";
import { isSecret } from "../database.js";
import { get2FA } from "../get2FA.js";

export class OneTimePassword extends BaseElement {
  constructor() {
    super("one-time-password");
    this.intervalId = 0;
    this.timeoutId = 0;
  }

  get $container() {
    return this.getElement(".container");
  }

  get $passwordOutput() {
    return this.getElement("output#password");
  }

  get $secondsOutput() {
    return this.getElement("output#seconds");
  }

  disconnectedCallback() {
    clearTimeout(this.timeoutId);
    clearInterval(this.intervalId);
  }

  /** @param {string} secret */
  set secret(secret) {
    clearTimeout(this.timeoutId);
    clearInterval(this.intervalId);
    this.$passwordOutput.value = "";
    this.$secondsOutput.value = "";

    if (!isSecret(secret)) {
      this.$container.style.visibility = "hidden";
      return;
    }

    this.$container.style.visibility = "visible";

    get2FA(secret).then((password) => {
      this.$passwordOutput.value = password;
    });

    // Everyone is talking about AI era... but we still need this old school trick!
    const self = this;

    this.timeoutId = setTimeout(
      () => {
        self.intervalId = setInterval(() => {
          const numSeconds = 30 - (Math.floor(Date.now() / 1000) % 30);
          self.$secondsOutput.value = numSeconds;
          if (numSeconds === 30) {
            get2FA(secret).then((password) => {
              self.$passwordOutput.value = password;
            });
          }
        }, 1000);
      },
      1000 - (Date.now() % 1000),
    );
  }
}
