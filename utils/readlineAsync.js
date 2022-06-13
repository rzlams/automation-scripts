const readline = require('readline')

module.exports = {
  open: () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return {
      question: (text) => new Promise((resolve) => rl.question(text, resolve)),

      close: () => rl.close(),
    }
  },
}
