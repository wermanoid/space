const times = require("lodash/fp/times");
const get = require("lodash/fp/get");
const { Suite } = require("benchmark");

const size = 1000;

// const arr = new Array(size).fill(1);

// const upd = () => {
//   for (let i = 0; i < size; i++) {
//     const a = arr[i] + i;
//     arr[i] = a + 1;
//   }
// };

function update() {
  const v = this.values;
  const u = this.updates;
  for (let i = 0; i < size; i++) {
    const a = v[i] + i;
    v[i] = a + u[i];
    u[i] += 0.1;
  }
}

function Arr() {
  this.values = new Array(size);
  this.updates = new Array(size);
  for (let i = 0; i < size; i++) {
    this.values[i] = 1.0;
    this.updates[i] = 1.1;
  }
}

Arr.prototype.update = update;

function Lol() {
  // const b = new ArrayBuffer(2 * size * Float32Array.BYTES_PER_ELEMENT);
  this.values = new Float32Array(size);
  this.updates = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    this.values[i] = 1.0;
    this.updates[i] = 1.1;
  }
}

Lol.prototype.update = update;

const a = new Arr();
const s = new Lol();

const suite = new Suite("native", {
  minSamples: 10000,
  maxTime: 60,
  async: true,
  delay: 1
});

suite
  .add("[AoS] simple", () => {
    a.update();
  })
  .add("[SoA]: system", () => {
    s.update();
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", () => {
    console.log("Fastest is " + suite.filter("fastest").map(get("name")));
    process.exit(0);
  })
  .run();
