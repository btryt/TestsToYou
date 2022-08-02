const { Router } = require("express")
const db = require("../../db")
const forEach = require("lodash.foreach")
const router = Router()

router.get("/result/:url", async (req, res) => {
  let url = req.params.url
  try {
    let result = await db.query(
      "SELECT testid,result,percentages,answers FROM finish_test WHERE url = $1",
      [url]
    )
    if (result.rows.length) {
      let tests = await db.query(
        "SELECT tests,show_correct_answer,title,id FROM tests WHERE id = $1",
        [result.rows[0].testid]
      )
      let showCorrectAnswer = tests.rows[0].show_correct_answer

      let testsWithoutAnswers = [...tests.rows[0].tests]
      if (!showCorrectAnswer) {
        forEach(testsWithoutAnswers, (val) => {
          forEach(val.variants, (vr) => {
            delete vr.correct
          })
        })
      }
      return res.send({
        title: tests.rows[0].title,
        tests: showCorrectAnswer ? tests.rows[0].tests : testsWithoutAnswers,
        answers: result.rows[0].answers,
        result: result.rows[0].result,
        percent: result.rows[0].percentages,
        showCorrectAnswer,
        testId: tests.rows[0].id,
      })
    }
    res.status(404).send([])
  } catch (e) {
    console.log(e)
    res.status(500).send([])
  }
})

module.exports = router
