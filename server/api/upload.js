const {Router} = require("express")
const upload = require("../multer/multer")
const fs = require("fs")
const path = require("path")
const router = Router()
const authMiddleware = require("../middleware/auth")
const db = require("../db")


  router.post("/upload",[authMiddleware,upload],async (req,res)=>{
     res.send("OK")
  })

  router.use((err,req,res,next)=>{
    if(err){
      fs.rmdir(path.join(__dirname,`../uploads/${req.session.lastTestId}`),(err)=>{
        if(err) console.log(err)
      })
      db.query("DELETE FROM tests WHERE id = $1",[req.session.lastTestId],(err)=>{
        if(err) console.log(err)
      })
      if(err.code === "WRONG_TYPE_FILE"){
        res.status(400).send(err.message)
      }
      else if(err.code === "LIMIT_FILE_SIZE"){
        res.status(400).send("Размер файла должен быть не более 2 МБ")
      }
    }
  })
  
module.exports = router