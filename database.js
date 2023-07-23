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
    for (const [key, value] of Object.entries(parsedDatabaseJson.accounts)) {
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

  get accountIds() {
    return this.accountMap.keys();
  }

  addAccount(newAccount) {
    if (!isAccount(newAccount)) throw new ErrorInvalidAccount();
    for (const account of this.accountMap.values())
      if (account.secret === newAccount.secret)
        throw new ErrorAccountSecretAlreadyExists();
    this.accountMap.set(this.newId, newAccount);
    this.whenUpdated = Date.now();
    this.writeToLocalStorage();
  }

  writeToLocalStorage() {
    localStorage.setItem(
      "database",
      JSON.stringify({
        whenUpdated: this.whenUpdated,
        accounts: Object.fromEntries(this.accountMap.entries()),
      })
    );
  }
}

export class ErrorInvalidAccount extends Error {
  constructor() {
    super("Invalid account");
  }
}

export class ErrorAccountSecretAlreadyExists extends Error {
  constructor() {
    super("Account secret already exists");
  }
}

export const database = new Database();
