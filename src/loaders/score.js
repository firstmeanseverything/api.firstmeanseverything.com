const DataLoader = require('dataloader')
const keyBy = require('lodash.keyby')

const db = require('../db')

module.exports = new DataLoader(async scoreIds => {
  const scores = await db.Score.find({ _id: { $in: scoreIds } }).exec()
  const scoresById = keyBy(scores, '_id')

  return scoreIds.map(scoreId => scoresById[scoreId])
})