const multer = require("multer")
const path = require("path")

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
    },
  })
  const upload = multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
          if(whitelist.includes(file.mimetype)){
              return cb(null,true)
          }
          else {
            return cb({code:"WRONG_TYPE_FILE",message:"Формат файла должен быть jpeg, jpg, pjpeg ,png, gif"},false)
          }
      },
      limits:{
          fileSize: (1024 * 1024) * 1,
          files: 60
      }
  }).any()


  module.exports = upload