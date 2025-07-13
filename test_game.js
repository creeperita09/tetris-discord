const fs = require('fs');
const runTetrisBot = require('./game');

(async () => {
  const buffer = await runTetrisBot(['a', 's', 'd', 'w', 'z', 'x', 'a']);
  fs.writeFileSync('animated_output.webp', buffer);
  console.log('Saved animated_output.webp');
})();
