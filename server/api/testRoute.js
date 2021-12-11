const {Router} = require("express")
const db = require("../db")
const forEach = require("lodash.foreach")
const getHash = require("../util/getHash")
const authMiddleware = require("../middleware/auth")
const {validate, ValidationError} = require('express-validation');
const creationScheme = require("../schemes/create")
const finishScheme = require("../schemes/finish")
const router = Router()


router.post("/test/create",[authMiddleware,validate(creationScheme)],async(req,res)=>{
    const body = req.body
    const uniqueTestId = new Set()
    const testsWithCorrectAnswer = new Set()
    const uniqueVariantId = new Set()
    const variantsIdArray = []
    let modifiedData = false
    forEach(body.tests,(test)=>{
      uniqueTestId.add(test.id)

      if(!test.multiple){
        if(test.variants.filter(f=> f.correct).length > 1){
          modifiedData = true
        }
      }
      if(test.multiple){
        if(test.variants.filter(f=> f.correct).length < 2){
          modifiedData = true
        }
      }
      forEach(test.variants,(variant)=>{
        if(variant.correct){
          testsWithCorrectAnswer.add(test.id)
          variantsIdArray.push(variant.id)
          uniqueVariantId.add(variant.id)
        }
      })
    })
    if(uniqueTestId.size !== body.tests.length || testsWithCorrectAnswer.size !== body.tests.length || variantsIdArray.length !== uniqueVariantId.size || modifiedData){
      return res.status(400).send({message:"Произошла ошибка при создании теста или данные были модифицированы"})
    }

    try{
        let url = getHash(7) 
        let id = req.session.userId
        await db.query("INSERT INTO tests (title,userid,url,show_correct_answer,tests,link_access) VALUES ($1,$2,$3,$4::boolean,$5::jsonb[],$6::boolean)",
        [body.testTitle,id,url,body.showCorrect,[...body.tests],body.linkAccess])
        res.send(true)
    }
    catch(e){
      console.log(e)
      res.status(500).send({message:"Что-то пошло не так при создании теста"})
    }
})

router.get("/test/find/:url",async(req,res)=>{
  let url = req.params.url
  try{
    const test = await db.query("SELECT tests,title,id FROM tests WHERE url = $1",[url])
    
    if(test.rows.length){
      let rows = test.rows[0]
      forEach(rows.tests,(val)=>{
        forEach(val.variants,(vr)=>{
           delete vr.correct
        })
      })
      return res.send({rows,title:rows.title,testId:rows.id})
    }
    res.status(404).send([])
  }
  catch(e){
    console.log(e)
    res.status(500).send([])
  }
})

router.get("/find/test",async (req,res)=>{
  const title = req.query.title
  const c = Number(req.query.c) === 0 ? 1 : Number(req.query.c)
  try{
    let count = await db.query("SELECT COUNT(id) FROM tests WHERE title ~* $1",[`(${title})`])
    let test = await db.query("SELECT url,title,id,link_access FROM tests WHERE title ~* $1 LIMIT $2",[`(${title})`, 5 * Number(c)])
    let rows = []
    test.rows.forEach(row=>{
      if(!row.link_access){
        rows.push(row)
      }
    })
    res.send({rows,numberOfRows:Number(count.rows[0].count)})
  }
  catch(e){
    res.status(500).send([])
    console.log(e)
  }
})

router.get("/test/list",authMiddleware,async (req,res)=>{
    try{
      let id =req.session.userId
      let tests = await db.query("SELECT title,id,url FROM tests WHERE userid = $1",[id])
      if(tests.rows.length){
          return res.send(tests.rows)
      }
      res.send([])
    }
    catch(e){
      console.log(e)
      res.status(500).send([])
    }
})

router.post("/test/delete",authMiddleware,async (req,res)=>{
  for(let i =0; i < req.body.length;i++){
    try{
      await db.query("BEGIN")
      let userID = req.session.userId
      let id = await db.query("SELECT testid FROM finish_test WHERE testid = $1 AND EXISTS (SELECT id FROM tests WHERE id = $1 AND userid = $2)",[req.body[i],userID])
      
      if(id.rows.length){
        await db.query("DELETE FROM finish_test WHERE testid = $1",[id.rows[0].testid])
      }
      await db.query("DELETE FROM tests WHERE id = $1 AND userid = $2",[req.body[i],userID])
      await db.query('COMMIT')
    }catch(e){
      console.log(e)
      await db.query('ROLLBACK')
      return res.status(500).send(false)
    }
  }
  res.send(true)
})

router.post("/test/finish",validate(finishScheme),async (req,res)=>{
  const body = req.body
  const uniqueTestId = new Set()
  const uniqueVariantId = new Set()
  const testsWithMultipleAnswers = new Set()
  const variantsIdArray = []
  let count = 0
  let total = 0
  let idNotFound = false
  let modifiedData = false
  forEach(body.answers,(answer)=>{
    uniqueTestId.add(answer.testId)

    if(answer.variants.filter(f=> f.correct).length !== answer.variants.length){
      modifiedData = true
    }
    if(answer.variants.filter(f=> f.correct).length > 1){
      testsWithMultipleAnswers.add(answer.testId)
    }
    forEach(answer.variants,(variant)=>{
      if(variant.correct){
        uniqueVariantId.add(variant.id)
        variantsIdArray.push(variant.id)
      }
    })
  })
  if(uniqueTestId.size !== body.answers.length || variantsIdArray.length !== uniqueVariantId.size || modifiedData){
    return res.status(400).send({message:"Произошла ошибка при завершении теста или данные были модифицированы"})
  }

  try{
    const test = await db.query("SELECT tests,show_correct_answer FROM tests WHERE id = $1",[body.testId])
    const url = getHash(7)
    if(test.rows.length){
        forEach(test.rows[0].tests,(val)=>{
          if(!uniqueTestId.has(val.id)){
            idNotFound = true
          }
          if(!val.multiple){
            if(testsWithMultipleAnswers.has(val.id)){
               modifiedData = true
            }
          }
            forEach(val.variants,(vr)=>{
                if(body.answers.some(b=> b.testId === val.id && b.variants.some(v=>v.id === vr.id) && vr.correct)){
                    count++ 
                }
                if(vr.correct){
                  total++
                }
                if(uniqueVariantId.has(vr.id)){
                  uniqueVariantId.delete(vr.id)
                }
            })
        })
      if(idNotFound || uniqueVariantId.size !== 0 || modifiedData){
        return res.status(400).send({message:"Произошла ошибка или вы пытаетесь модифицировать данные"})
      }
      const percentages = (count * 100) / total 
      
      await db.query("INSERT INTO finish_test (name,testid,url,result,percentages,answers,finish_time) VALUES ($1,$2,$3,$4,$5,$6::jsonb[],$7)",
      [body.name,body.testId,url,`${count}/${total}`,percentages.toFixed(1),[...body.answers],
      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`])

      res.send({url})
    }
    else{
      res.status(400).send({message:"Не удалось завершить тест"})
    }
  }
  catch(e){
    console.log(e)
    res.status(500).send({message:"Произошла ошибка при завершении теста"})
  }
})

router.get("/test/result/:url",async (req,res)=>{
  let url = req.params.url
  try{
    let result = await db.query("SELECT testid,result,percentages,answers FROM finish_test WHERE url = $1",[url])
    if(result.rows.length){
      let tests = await db.query("SELECT tests,show_correct_answer,title FROM tests WHERE id = $1",[result.rows[0].testid])
      let showCorrectAnswer = tests.rows[0].show_correct_answer
      
      let testsWithoutAnswer = [...tests.rows[0].tests]
      if(!showCorrectAnswer){
        forEach(testsWithoutAnswer,(val)=>{
          forEach(val.variants,(vr)=>{
            delete vr.correct
          })
        })
    }
     return res.send({title:tests.rows[0].title,tests:showCorrectAnswer ? tests.rows[0].tests : testsWithoutAnswer,answers:result.rows[0].answers,result:result.rows[0].result,percent:result.rows[0].percentages,showCorrectAnswer})
    }
    res.status(404).send([])
  }
  catch(e){
    console.log(e)
    res.status(500).send([])
  }
})

router.get("/test/results",authMiddleware,async(req,res)=>{
  const id = req.query.id
  try{
    const finishedTests = await db.query("SELECT name,percentages,result,url,id,testid,to_char(finish_time,'YYYY-MM-DD HH24:MI:SS') AS finish_time FROM finish_test WHERE testid = (SELECT id FROM tests WHERE userid = $1 AND id = $2)",[req.session.userId,id])
    
    
    res.send(finishedTests.rows)
  }
  catch(e){
    console.log(e)
    res.status(500).send([])
  }
})

router.post("/test/result/delete",authMiddleware,async (req,res)=>{
  const selected = req.body
  for(let i =0; i < selected.length;i++){
    try{
      await db.query("DELETE FROM finish_test WHERE id = $1 AND EXISTS (SELECT id FROM tests WHERE id = $2 AND userid = $3 ) ",[selected[i].id,selected[i].testid,req.session.userId])
    }
    catch(e){
      console.log(e)
      return res.status(500).send([])
    }
  }
  res.send(Math.random().toString())
})


router.use("/test/create",function(err, req, res, next){
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({message:"Превышена длина названия теста или варианта"})
  }
  return res.status(500).json({message:"Произошла неизвестная ошибка"})
})

router.use("/test/finish",function(err, req, res, next){
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({message:"Указанное имя превышает допустимую длину или с ответами что-то не так"})
  }
  return res.status(500).json({message:"Произошла неизвестная ошибка"})
})

module.exports = router