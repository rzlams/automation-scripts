const readline = require('./readlineAsync')

const mockQuestion = jest.fn()
const mockClose = jest.fn()
const mockCreateInterface = jest.fn(() => ({
  question: (text, callback) => {
    const answer = mockQuestion(text)
    callback(answer)
  },
  close: () => mockClose(),
}))
jest.mock('readline', () => ({
  __esModule: true,
  createInterface: (config) => mockCreateInterface(config),
}))

describe('readlineAsync test suite', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('question method', () => {
    it('should return any answer when receive no valid answers to validate', async () => {
      const mockAnswer = 'FAKE_ANSWER'
      const text = 'FAKE QUESTION_TEXT'

      mockQuestion.mockReturnValueOnce(mockAnswer)

      const rl = readline.open()
      const answer = await rl.question(text) // NO valid answer passed
      rl.close()

      expect(mockCreateInterface).toHaveBeenCalledTimes(1)
      expect(mockQuestion).toHaveBeenCalledTimes(1)
      expect(mockClose).toHaveBeenCalledTimes(1)
      expect(answer).toBe(mockAnswer)
    })

    it('should return the answer when is present in the valid answers argument', async () => {
      const mockFirstInvalidAnswer = 'FIRST_FAKE_INVALID_ANSWER'
      const mockSecondInvalidAnswer = 'SECOND_FAKE_INVALID_ANSWER'
      const mockValidAnswer = 'FAKE_VALID_ANSWER'
      const text = 'FAKE QUESTION_TEXT'
      const validAnswers = [mockValidAnswer]

      mockQuestion.mockReturnValueOnce(mockFirstInvalidAnswer)
      mockQuestion.mockReturnValueOnce(mockSecondInvalidAnswer)
      mockQuestion.mockReturnValueOnce(mockValidAnswer)

      const rl = readline.open()
      const answer = await rl.question(text, validAnswers)
      rl.close()

      expect(mockCreateInterface).toHaveBeenCalledTimes(1)
      expect(mockQuestion).toHaveBeenCalledTimes(3)
      expect(mockClose).toHaveBeenCalledTimes(1)
      expect(answer).toBe(mockValidAnswer)
    })
  })

  describe('questionGroup method', () => {
    it('should return the answers when all of them are valid and restart from the first question when not', async () => {
      const questions = [
        { text: () => `FIRST_FAKE_QUESTION`, validAnswers: [] },
        { text: (answers) => `FIRST_FAKE_QUESTION_INCLUDING_PREVIOUS_ANSWER - ${answers[0]}`, validAnswers: ['5'] },
        { text: (answers) => `SECOND_FAKE_QUESTION_INCLUDING_PREVIOUS_ANSWER - ${answers[1]}`, validAnswers: ['10', '20', '30'] },
        { text: () => `SECOND_FAKE_QUESTION`, validAnswers: ['1'] },
      ]

      const firstFakeQuestionValidAnswer = 'FIRST_FAKE_QUESTION_VALID_ANSWER'
      const invalidFakeAnswer = 'INVALID_FAKE_ANSWER'
      mockQuestion
        .mockReturnValueOnce(firstFakeQuestionValidAnswer)
        .mockReturnValueOnce(invalidFakeAnswer)
        .mockReturnValueOnce(firstFakeQuestionValidAnswer)
        .mockReturnValueOnce(questions[1].validAnswers[0])
        .mockReturnValueOnce(invalidFakeAnswer)
        .mockReturnValueOnce(firstFakeQuestionValidAnswer)
        .mockReturnValueOnce(questions[1].validAnswers[0])
        .mockReturnValueOnce(questions[2].validAnswers[1])
        .mockReturnValueOnce(invalidFakeAnswer)
        .mockReturnValueOnce(firstFakeQuestionValidAnswer)
        .mockReturnValueOnce(questions[1].validAnswers[0])
        .mockReturnValueOnce(questions[2].validAnswers[2])
        .mockReturnValueOnce(questions[3].validAnswers[0])

      const mockedAnswers = [firstFakeQuestionValidAnswer, questions[1].validAnswers[0], questions[2].validAnswers[2], questions[3].validAnswers[0]]

      const rl = readline.open()
      const answers = await rl.questionGroup(questions)
      rl.close()

      expect(mockCreateInterface).toHaveBeenCalledTimes(1)
      expect(mockQuestion).toHaveBeenCalledTimes(13)
      expect(mockClose).toHaveBeenCalledTimes(1)
      expect(answers).toEqual(mockedAnswers)
    })
  })
})
