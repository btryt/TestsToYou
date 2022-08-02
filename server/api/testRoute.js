const {Router} = require("express")
const router = Router()
const addRating = require("./testRoutes/addRating")
const createTest = require("./testRoutes/createTest")
const deleteResult = require("./testRoutes/deleteResult")
const deleteTest = require("./testRoutes/deleteTest")
const find = require("./testRoutes/findTest")
const finishTest = require("./testRoutes/finishTest")
const getRating = require("./testRoutes/getRating")
const getResult = require("./testRoutes/getResult")
const getResults = require("./testRoutes/getResults")
const getTest = require("./testRoutes/getTest")
const testList = require("./testRoutes/testList")


router.use("/test", addRating)
router.use("/test", createTest)
router.use("/test", deleteResult)
router.use("/test", deleteTest)
router.use("/test", find)
router.use("/test", finishTest)
router.use("/test", getRating)
router.use("/test", getResult)
router.use("/test", getResults)
router.use("/test", getTest)
router.use("/test", testList)


module.exports = router