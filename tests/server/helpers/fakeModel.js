// A tiny in-memory stand-in for a Mongoose model, so the server tests can
// run without downloading or starting a real MongoDB.
// Supports only what the controllers use: find, findOne, findById, create,
// plus the chainable query helpers populate / sort / lean.

let counter = 0;
const newId = () => (++counter).toString(16).padStart(24, '0');

function matches(doc, filter = {}) {
  return Object.entries(filter).every(([key, cond]) => {
    const value = doc[key]?.toString();
    if (cond && typeof cond === 'object' && '$ne' in cond) return value !== String(cond.$ne);
    return value === String(cond);
  });
}

// Chainable, awaitable query like Mongoose's (populate/sort are no-ops here).
class Query {
  constructor(run) { this.run = run; }
  populate() { return this; }
  sort() { return this; }
  lean() { return this; }
  then(resolve, reject) { return Promise.resolve().then(this.run).then(resolve, reject); }
}

export function makeFakeModel() {
  const docs = [];
  return {
    async create(data) {
      const now = new Date();
      const doc = { _id: newId(), createdAt: now, updatedAt: now, ...data };
      docs.push(doc);
      return { ...doc };
    },
    find(filter) {
      return new Query(() => docs.filter((d) => matches(d, filter)).map((d) => ({ ...d })));
    },
    findOne(filter) {
      return new Query(() => {
        const d = docs.find((x) => matches(x, filter));
        return d ? { ...d } : null;
      });
    },
    findById(id) {
      return this.findOne({ _id: id });
    },
    _reset() { docs.length = 0; }
  };
}
