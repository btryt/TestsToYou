const { Router } = require("express")
const { validate, ValidationError} = require("express-validation")
const db = require("../../db")
const getHash = require("../../util/getHash")
const finishSchema = require("../../schemes/finish")
const validateData = require("../../validations/testFinish")
const router = Router()

router.post("/finish", validate(finishSchema), async (req, res) => {
  const body = req.body
  let total = 0

  try {
    const test = await db.query(
      "SELECT tests,show_correct_answer FROM tests WHERE id = $1",
      [body.testId]
    )

    let result = validateData(body, test)
    if (!result.ok) {
      return res
        .status(400)
        .send({
          message: "Произошла ошибка или вы пытаетесь модифицировать данные",
        })
    }
    const url = getHash(7)
    if (test.rows.length) {
      total = test.rows[0].tests.length
      const percentages = (result.data.count * 100) / total

      await db.query(
        "INSERT INTO finish_test (name,testid,url,result,percentages,answers,finish_time) VALUES ($1,$2,$3,$4,$5,$6::jsonb[],$7)",
        [
          body.name,
          body.testId,
          url,
          `${result.data.count}/${total}`,
          percentages.toFixed(1),
          [...body.answers],
          `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        ]
      )

      res.send({ url })
    } else {
      res.status(400).send({ message: "Не удалось завершить тест" })
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Произошла ошибка при завершении теста" })
  }
})

router.use("/test/finish",function(err, req, res, next){
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({message:"Указанное имя превышает допустимую длину или с ответами что-то не так"})
    }
    return res.status(500).json({message:"Произошла неизвестная ошибка"})
  })

module.exports = router
