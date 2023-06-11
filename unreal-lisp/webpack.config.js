const path = require('path');
const fs = require('fs');

module.exports = {
  mode: 'none',
  target: 'node',
  entry: './.valtan-cache/unreal-lisp.js',
  output: {
    filename: 'unreal_lisp.js',
      path: path.resolve('/mnt/c/Users/chand/Documents/Unreal Projects/LispProject/Content', 'Scripts')
  },
  resolve: {
    modules: [
      'node_modules',
      fs.readFileSync('.valtan-path', 'utf-8')
    ]
  }
};
