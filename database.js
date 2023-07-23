export const isSecret = (arg) => {
  if (typeof arg !== "string") return false;
  if (arg.length !== 32) return false;
  for (let i = 0; i < arg.length; i++)
    if (!"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".includes(arg[i])) return false;
  return true;
};

export const isAccount = (arg) => {
  if (!arg || typeof arg !== "object") return false;
  const { name, secret } = arg;
  if (typeof name !== "string") return false;
  if (name.length === 0) return false;
  return isSecret(secret);
};

class Database {
  constructor() {
    this.accountMap = new Map();
    const databaseJson = localStorage.getItem("database");
    if (!databaseJson) {
      this.whenUpdated = Date.now();
      return;
    }
    const parsedDatabaseJson = JSON.parse(databaseJson);
    this.whenUpdated = parsedDatabaseJson.whenUpdated;
    for (const [key, value] of parsedDatabaseJson.accounts) {
      this.accountMap.set(key, value);
    }
  }

  get newId() {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 5);
  }

  get numAccounts() {
    return this.accountMap.size;
  }

  addAccount(account) {
    if (!isAccount(account)) throw new ErrorInvalidAccount();
    this.accountMap.set(this.newId, account);
    this.whenUpdated = Date.now();
    this.writeToLocalStorage();
    return new CustomEvent("addAccount", {
      detail: account,
    });
  }

  writeToLocalStorage() {
    localStorage.setItem("database", {
      whenUpdated: this.whenUpdated,
      accounts: Object.fromEntries(this.accountMap.entries()),
    });
  }
}

export class ErrorInvalidAccount extends Error {
  constructor() {
    super("Invalid account");
  }
}

export const database = new Database();
