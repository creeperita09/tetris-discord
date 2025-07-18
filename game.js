const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { execSync } = require('child_process');
const Gameboy = require('serverboy');

const KEYMAP = Gameboy.KEYMAP;

const keyMap = {
  w: KEYMAP.UP,
  a: KEYMAP.LEFT,
  s: KEYMAP.DOWN,
  d: KEYMAP.RIGHT,
  z: KEYMAP.A,
  x: KEYMAP.B,
};

function renderFrame(gb) {
  const pixels = gb.getScreen();
  const canvas = createCanvas(160, 144);
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(160, 144);
  imgData.data.set(pixels);
  ctx.putImageData(imgData, 0, 0);
  return canvas.toBuffer('image/png');
}

function runStartupSequence(gb) {
  function doFrames(n, holdStart = false) {
    for (let i = 0; i < n; i++) {
      if (holdStart) gb.pressKey(KEYMAP.START);
      gb.doFrame();
      gb.doFrame();
    }
  }

  doFrames(11);
  doFrames(7, true);
  doFrames(1);
  doFrames(6, true);
  doFrames(1);
  doFrames(2, true);
  doFrames(1);
  doFrames(1, true);
  doFrames(1);
  doFrames(1, true);
  doFrames(1);
  doFrames(2, true);
  doFrames(1);
  doFrames(1, true);
  doFrames(4);
  doFrames(8, true);
  doFrames(6);
}

async function simulateInputs(gb, instructions) {
  const sequenceName = instructions.join('') || 'default';
  const baseDir = path.join(__dirname, 'temp', sequenceName);
  fs.mkdirSync(baseDir, { recursive: true });

  const framePaths = [];

  for (let char of instructions) {
    const key = keyMap[char];
<<<<<<< HEAD
    if (char == "w") {
      var frames = "11";
    } else {
      var frames = "25";
    }
    for (let i = 0; i < frames; i++) {
      if (key || key == 0) {
        gb.pressKey(key);
      }
=======
    if (!key) continue;

    for (let i = 0; i < 30; i++) {
      gb.pressKey(key);
>>>>>>> ec3590884ab7e042127b794c55c01d00fcc11fd9
      gb.doFrame();
      gb.doFrame();
      if (i % 4 === 0) {
        const framePath = path.join(baseDir, `frame_${framePaths.length.toString().padStart(4, '0')}.png`);
        fs.writeFileSync(framePath, renderFrame(gb));
        framePaths.push(framePath);
      }
    }

<<<<<<< HEAD
    // Release key for 5 logic frames (10 actual frames)
    for (let i = 0; i < 5; i++) {
=======
    // Release key for 1 logic frame
    for (let i = 0; i < 1; i++) {
>>>>>>> ec3590884ab7e042127b794c55c01d00fcc11fd9
      gb.doFrame();
      gb.doFrame();
      if (i % 4 === 0) {
        const framePath = path.join(baseDir, `frame_${framePaths.length.toString().padStart(4, '0')}.png`);
        fs.writeFileSync(framePath, renderFrame(gb));
        framePaths.push(framePath);
      }
    }
  }

  // Only use the last 5 actions = last 31 frames max
  const lastFrames = framePaths.slice(-31);
  const webpOutput = path.join(baseDir, `output.webp`);

  const inputList = lastFrames.map(f => `"${f}"`).join(' ');
<<<<<<< HEAD

  // It's magick for imagemagick v7 and convert for v6 
  const convertCmd = `magick -delay 3 ${inputList} -loop 1 "${webpOutput}"`;
  execSync(convertCmd);

  // Read the webp buffer before cleanup
  const buffer = fs.readFileSync(webpOutput);

  // Cleanup all PNGs + output.webp
  for (const file of fs.readdirSync(baseDir)) {
    fs.unlinkSync(path.join(baseDir, file));
  }
  gb = null;
  return buffer;
}

async function runTetrisBot(instructionList) {
  const gb = new Gameboy();
  const rom = fs.readFileSync('rom.gb');
  gb.loadRom(rom);
=======
  const convertCmd = `magick -delay 3 ${inputList} -loop 1 "${webpOutput}"`;
  execSync(convertCmd);

  const buffer = fs.readFileSync(webpOutput);

  // Cleanup
  for (const file of fs.readdirSync(baseDir)) {
    const full = path.join(baseDir, file);
    if (file !== 'output.webp') fs.unlinkSync(full);
  }

  return buffer;
}

async function runTetrisBot(instructionList = ['a', 's', 'w', 'z', 'd', 'x']) {
  const gb = new Gameboy();
  const rom = fs.readFileSync('rom.gb');
  gb.loadRom(rom);

>>>>>>> ec3590884ab7e042127b794c55c01d00fcc11fd9
  runStartupSequence(gb);
  const buffer = await simulateInputs(gb, instructionList);
  return buffer;
}

module.exports = runTetrisBot;
