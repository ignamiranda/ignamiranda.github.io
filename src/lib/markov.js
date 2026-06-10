export class MarkovChain {
  constructor(seeds, order = 2) {
    this.order = order;
    this.chain = new Map();
    this.rng = Math.random;

    for (const seed of seeds) {
      if (seed.length > 1) this._addSeed(seed.toLowerCase());
    }
  }

  _addSeed(word) {
    const key = "\0".repeat(this.order) + word + "\0";
    for (let i = 0; i < key.length - this.order; i++) {
      const context = key.slice(i, i + this.order);
      const next = key[i + this.order];
      if (!this.chain.has(context)) {
        this.chain.set(context, []);
      }
      this.chain.get(context).push(next);
    }
  }

  generate(maxLength = 10) {
    let result = "\0".repeat(this.order);
    let context = result;
    const startChar = "\0";

    for (let i = 0; i < maxLength * 3; i++) {
      const possible = this.chain.get(context);
      if (!possible || possible.length === 0) break;

      const next = possible[Math.floor(this.rng() * possible.length)];
      if (next === startChar) break;

      result += next;
      context = result.slice(-this.order);

      if (result.replace(/\0/g, "").length >= maxLength) break;
    }

    result = result.replace(/\0/g, "");
    if (result.length < 3) return "";
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  generateMany(count = 5, maxLength = 10) {
    const names = new Set();
    let attempts = 0;
    const maxAttempts = count * 15;

    while (names.size < count && attempts < maxAttempts) {
      const name = this.generate(maxLength);
      if (name && name.length >= 3) {
        names.add(name);
      }
      attempts++;
    }

    if (names.size < count) {
      console.warn(`markov: requested ${count} names, generated ${names.size} unique names`);
    }

    return Array.from(names);
  }
}
