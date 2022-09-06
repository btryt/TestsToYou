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


router.use(addRating)
router.use(createTest)
router.use(deleteResult)
router.use(deleteTest)
router.use(find)
router.use(finishTest)
router.use(getRating)
router.use(getResult)
router.use(getResults)
router.use(getTest)
router.use(testList)


module.exports = router