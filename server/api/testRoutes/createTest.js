const {Router} = require("express")
const {validate, ValidationError} = require('express-validation');
const creationSchema = require("../../schemes/create")
const authMiddleware = require("../../middleware/auth")
const validateData = require("../../validations/testCreate")
const db = require("../../db")
const getHash = require("../../util/getHash")
const fs = require("fs")
const path = require("path")
const router = Router()

router.post("/create",[authMiddleware,validate(creationSchema)],async(req,res)=>{
    const body = req.body

    const result = validateData(body)

    if(!result.ok){
      return res.status(400).send({message:"Произошла ошибка при создании теста или данные были модифицированы"})
    }
    try{
        let url = getHash(7) 
        let id = req.session.userId
        let testId = await db.query("INSERT INTO tests (title,userid,url,show_correct_answer,tests,link_access) VALUES ($1,$2,$3,$4::boolean,$5::jsonb[],$6::boolean) RETURNING id",
        [body.testTitle,id,url,body.showCorrect,[...body.tests],body.linkAccess])
        if(testId.rows.length){
          await fs.promises.mkdir(path.join(__dirname,`../../uploads/${testId.rows[0].id}`))

          req.session.lastTestId = testId.rows[0].id
        }
        res.send(true)
    }
    catch(e){
      if(req.session.lastTestId){
        db.query("DELETE FROM tests WHERE id = $1",[req.session.lastTestId],(err)=>{
          if(err) console.log(err)
        })
        fs.rmdir(path.join(__dirname,`../../uploads/${req.session.lastTestId}`),(err)=>{
          if(err) console.log(err)
        })
      }
      console.log(e)
      res.status(500).send({message:"Что-то пошло не так при создании теста"})
    }
})

router.use("/create",function(err, req, res, next){
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({message:"Превышена длина названия теста или варианта"})
    }
    return res.status(500).json({message:"Произошла неизвестная ошибка"})
  })

module.exports = router