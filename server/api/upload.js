const {Router} = require("express")
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const router = Router()
const authMiddleware = require("../middleware/auth")
const db = require("../db")
const whitelist = [
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/jpg",
  "image/gif"
]
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const testId = req.session.lastTestId
      cb(null, path.join(__dirname,`../uploads/${testId}`))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname)
    }
  })
  const upload = multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
          if(whitelist.includes(file.mimetype)){
              return cb(null,true)
          }
          else {
            fs.rmdir(path.join(__dirname,`../uploads/${req.session.lastTestId}`),(err)=>{
              if(err) console.log(err)
            })
            db.query("DELETE FROM tests WHERE id = $1",[req.session.lastTestId],(err)=>{
              if(err) console.log(err)
            })
            return cb({code:"WRONG_TYPE_FILE",message:"Формат картинки должен быть jpeg, jpg, png"},false)
          }
      },
      limits:{
          fileSize: (1024 * 1024) * 2,
      }
  }).any()

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