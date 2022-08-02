const { Router } = require("express")
const db = require("../../db")
const authMiddleware = require("../../middleware/auth")
const router = Router()

router.post("/result/delete", authMiddleware, async (req, res) => {
  const selected = req.body
  for (let i = 0; i < selected.length; i++) {
    try {
      await db.query(
        "DELETE FROM finish_test WHERE id = $1 AND EXISTS (SELECT id FROM tests WHERE id = $2 AND userid = $3 ) ",
        [selected[i].id, selected[i].testid, req.session.userId]
      )
    } catch (e) {
      console.log(e)
      return res.status(500).send([])
    }
  }
  res.send(Math.random().toString())
})

module.exports = router
