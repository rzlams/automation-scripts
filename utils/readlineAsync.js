const readline = require('readline')

module.exports = {
  open: () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const asyncQuestion = (text) => new Promise((resolve) => rl.question(text, resolve))

    // solo retorna cuando la respuesta recibida es valida
    const question = async (text, validAnswers = []) => {
      let answer = null
      let isInvalidAnswer = true

      do {
        answer = await asyncQuestion(text)

        if (validAnswers.length === 0) isInvalidAnswer = false
        else isInvalidAnswer = validAnswers.every((vr) => vr !== answer)
      } while (isInvalidAnswer)

      return answer
    }

    // solo retorna cuando todas las respuestas recibidas son validas
    // si recibe una respuesta invalida vuelve a preguntar de nuevo desde la primera pregunta
    const questionGroup = async (questions) => {
      const answers = []
      let isInvalidAnswer = true

      do {
        for (let currentQuestionIndex = 0; currentQuestionIndex < questions.length; currentQuestionIndex += 1) {
          const q = questions[currentQuestionIndex]

          const currentAnswer = await asyncQuestion(q.text)

          if (!q.validAnswers || q.validAnswers.length === 0) isInvalidAnswer = false
          else isInvalidAnswer = q.validAnswers.every((vr) => vr !== currentAnswer)

          if (isInvalidAnswer) {
            answers.length = 0
            break
          }

          answers.push(currentAnswer)
        }
      } while (isInvalidAnswer)

      return answers
    }

    return {
      question,

      questionGroup,

      close: () => rl.close(),
    }
  },
}
