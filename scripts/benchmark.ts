import { Suite, Options } from 'benchmark';
import glob from 'fast-glob';
import { join } from 'path';

const suite = new Suite('Space benchmarks', {
  minSamples: 10000,
  maxTime: 60,
  async: true,
  delay: 1,
})
  .on('cycle', (event: any) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    process.exit(0);
  });

glob(['src/**/*.bench.ts']).then(globs => {
  globs
    .map(bench => require(join(process.cwd(), bench)).default)
    .reduce((acc, suites) => acc.concat(suites), [])
    .forEach((benchConfig: Options) => suite.add(benchConfig));
  suite.run();
});
