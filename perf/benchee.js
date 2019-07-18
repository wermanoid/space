const times = require("lodash/fp/times");
const get = require("lodash/fp/get");
const { Suite } = require("benchmark");

const size = 1000;

const rs = times(i => i, size); // [1, 2, 3, 4, 5],
const ps = times(i => [i, i], size); // [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
const ids = times(i => i, size); // [0, 1, 2, 3, 4]
const os = times(i => ({ r: i, c: [i, i] }), size);
const composed = times(i => [[i, i], i], size);

const temp = {
  save() {},
  restore() {},
  a: 0,
  b: 0,
  r: 0,
  render(x, y, r) {
    this.a = x;
    this.b = y;
    this.r = r;
  }
};

const render = ([x, y], r) => {
  temp.save();
  temp.render(x, y, r);
  temp.restore();
};

const upd = coords => {
  coords[0] += 1;
  coords[1] += 1;
};

const exe1_1 = (coords, rads) => {
  for (let i = 0, id = ids[i]; i < ids.length; i++) {
    render(coords[id], rads[id]);
  }
};

const upd1_1 = coords => {
  for (let i = 0, id = ids[i]; i < ids.length; i++) {
    upd(coords[id]);
  }
};

const exe1_2 = () => {
  for (let i = 0, id = ids[i]; i < ids.length; i++) {
    let x = ps[id];
    render(x, rs[id]);
  }
};

const upd1_2 = () => {
  for (let i = 0, id = ids[i]; i < ids.length; i++) {
    upd(ps[id]);
  }
};

// ******* array with objects *******
const exe2_1 = objects => {
  for (let i = 0, { c, r } = objects[ids[i]]; i < ids.length; i++) {
    // const { c, r } = objects[id];
    render(c, r);
  }
};

const upd2_1 = objects => {
  for (let i = 0, id = ids[i]; i < ids.length; i++) {
    upd(objects[id].c);
  }
};
// ******* array with objects *******

// ****************************
const system = {
  own: times(i => i, size),
  exe(coords, rads) {
    const list = this.own;
    for (let i = 0, id = list[i]; i < list.length; i++) {
      render(coords[id], rads[id]);
    }
  },
  upd(coords) {
    const list = this.own;
    for (let i = 0, id = list[i]; i < list.length; i++) {
      upd(coords[id]);
    }
  }
};

// ****************************
// const system2 = {
//   own: times(i => i, size),
//   exe(comp) {
//     const list = this.own;
//     for (let i = 0, id = list[i]; i < list.length; i++) {
//       let s = comp[id];
//       render(s[0], s[1]);
//     }
//   },
//   upd(comp) {
//     const list = this.own;
//     for (let i = 0, id = list[i]; i < list.length; i++) {
//       upd(comp[id][0]);
//     }
//   }
// };

const suite = new Suite("native", {
  minSamples: 10000,
  maxTime: 60,
  async: true,
  delay: 1
});

suite
  .add("[AoS] simple", () => {
    exe2_1(os);
    upd2_1(os);
  })
  .add("[SoA]: references", () => {
    exe1_1(ps, rs);
    upd1_1(ps);
  })
  .add("[SoA]: direct", () => {
    exe1_2();
    upd1_2();
  })
  .add("[SoA]: system with references", () => {
    system.exe(ps, rs);
    system.upd(ps, rs);
  })
  // .add("[SoA]: system reference to composition", () => {
  //   system2.exe(composed);
  //   system2.upd(composed);
  // })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", () => {
    console.log("Fastest is " + suite.filter("fastest").map(get("name")));
    process.exit(0);
  })
  .run();
