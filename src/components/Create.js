import React, { useRef, useState, useCallback, useEffect } from "react"
import debounce from 'lodash.debounce'
import {
  TextField,
  Grid,
  Button,
  FormControl,
  Box,
  Typography,
  Checkbox,
  Tooltip,
  FormControlLabel,
  Toolbar,
  Paper,
} from "@material-ui/core"
import {  makeStyles } from '@material-ui/core/styles';
import Alert from './Alert'
import ReCAPTCHA from "react-google-recaptcha"

const useStyle = makeStyles((theme)=>({
  paper:{
    padding: theme.spacing(1),
    margin:theme.spacing(1)
  }
}))

let testData = []
const Create = ({setActive}) => {
  const style = useStyle()
  const [tests, setTests] = useState([])
  const [testVariants,setTestVariants] = useState([])
  const [emptyTestTitle,setEmptyTestTitle] = useState([])
  const [emptyVariantTitle,setEmptyVariantTitle] = useState([])
  const [characterLimitExceededTitle,setCharacterLimitExceededTitle] = useState([])
  const [characterLimitExceededVariant,setCharacterLimitExceededVariant] = useState([])
  const [error,setError] = useState(null)
  const [showCorrect,setShowCorrect] = useState(false)
  const [linkAccess,setLinkAccess] = useState(false)
  const [testTitle, setTestTitle] = useState("")
  const [step, setStep] = useState(0)
  const [validRecaptcha,setValidRecaptcha] = useState(false)
  const ref = useRef()

  useEffect(()=>{
    testData = []
  },[])

  const addTitle = useCallback(() => {
    if (ref.current.value.trim() && ref.current.value.trim().length <= 120 && ref.current.value.trim().length >= 5) {
      setTestTitle(ref.current.value.trim())
      setStep((prev) => prev + 1)
    }
  }, [])
  
  const changeTestTitle = debounce((e,id)=>{
      let array = [...tests]
      let testIndex = array.findIndex((test) => test.id === id)
      if(e.target.value.trim().length >=210){
        if(!characterLimitExceededTitle.some(ch=> ch.id === id)){
          setCharacterLimitExceededTitle(prev => [...prev,{id}])
        }
      }
      else{
        if(characterLimitExceededTitle.some(ch=> ch.id === id)){
          let arrayCharracter = [...characterLimitExceededTitle]
          let index = arrayCharracter.findIndex(cr => cr.id === id)
          arrayCharracter.splice(index,1)
          setCharacterLimitExceededTitle(arrayCharracter)
        }
        testData[testIndex].title = e.target.value.trim()
        
      }
  },300)
  const addQuestion = useCallback(() => {
    if(tests.length <= 40){
      const id = new Date().getTime()
      const variantId = new Date().getTime()
      setTests((prev) => [
        ...prev,
        {
          id
        },
      ])
      setTestVariants(prev=>[...prev,{testId:id,variants: [{ id: variantId }]}])
      testData.push({
        id,
        title: "",
        variants: [{ id: variantId, title: "", correct: true }],
        multiple: false,})
        
  }
  }, [tests.length])
  const deleteQuestion = useCallback(
    (id) => {
      let array = [...tests]
      let testIndex = array.findIndex((test) => test.id === id)
      array.splice(testIndex,1)
      testData.splice(testIndex,1)
      setTests(array)
    },
    [tests]
  )

  const addVariant = useCallback((id) => {
      let dateId = new Date().getTime()
      let array = [...tests]
      let variants = [...testVariants]
      let testIndex = array.findIndex((test) => test.id === id)
      
      if(testData[testIndex].variants.length === 4) return

      variants[testIndex].variants.push({id: dateId, correct: false})
      
      testData[testIndex].variants.push({id: dateId, title: "", correct: false})
      setTestVariants(variants)
    },
    [testVariants,tests]
  )
  const deleteVariant = useCallback(
    (id, variantId) => {
      let array = [...tests]
      let testIndex = array.findIndex((test) => test.id === id)
      let variantIndex = testData[testIndex].variants.findIndex( (variant) => variant.id === variantId)
      if(testData[testIndex].variants.filter((el)=>el.correct === true).length < 2 && testData[testIndex].variants.length > 1 && testData[testIndex].variants[variantIndex].correct) return 
      if(testVariants[testIndex].variants.length === 1) return
      testVariants[testIndex].variants.splice(variantIndex, 1)
      testData[testIndex].variants.splice(variantIndex,1)
      setTests(array)
    },
    [tests,testVariants]
  )
  const setCorrectVariant = useCallback((id,variantId)=>{
    let array = [...tests]
    
    let testIndex = array.findIndex((test) => test.id === id)
    let variantIndex = testData[testIndex].variants.findIndex( (variant) => variant.id === variantId)
    if(testData[testIndex].variants.filter((el)=>el.correct === true).length < 2 && testData[testIndex].variants.length > 1 && testData[testIndex].variants[variantIndex].correct) return 

    if(testData[testIndex].variants.length > 1){ 
      testData[testIndex].variants[variantIndex].correct = !testData[testIndex].variants[variantIndex].correct
      
    }
    
    testData[testIndex].multiple = testData[testIndex].variants.filter((el)=>el.correct === true).length > 1 ? true : false
    setTests(array)
    
  },[tests])
    
  const changeTestVariantTitle = debounce((e,id,variantId)=>{
      let array = [...tests]
      let testIndex = array.findIndex((test) => test.id === id)
      let variantIndex = testVariants[testIndex].variants.findIndex( (variant) => variant.id === variantId)
      if(e.target.value.trim().length >= 150){
        if(!characterLimitExceededVariant.some(ch=> ch.id === variantId)){
          setCharacterLimitExceededVariant(prev => [...prev,{id:variantId}])
        }
      }
      else{
        if(characterLimitExceededVariant.some(ch=> ch.id === variantId)){
          let arrayCharacterVariant = [...characterLimitExceededVariant]
          let index = arrayCharacterVariant.findIndex(ch=> ch.id === variantId)
          arrayCharacterVariant.splice(index,1)
          setCharacterLimitExceededVariant(arrayCharacterVariant)
        }
        testData[testIndex].variants[variantIndex].title = e.target.value.trim()
        
      }
  },300)
  const createTest = useCallback(()=>{
    let checked = true
    setError(null)
    setEmptyTestTitle([])
    setEmptyVariantTitle([])
    let array = [...testData]
    array.forEach((test,index)=>{
      if(!test.title.trim()){
        checked = false
        setEmptyTestTitle(prev => [...prev,index+1])
      }
      test.variants.forEach((variant,i)=>{
        if(!variant.title.trim()){
          checked = false
          setEmptyVariantTitle(prev=>[...prev,{test:index+1,variant:i+1}])
        }
      })
    })
    if(!characterLimitExceededTitle.length && !characterLimitExceededVariant.length && checked && validRecaptcha ){
      fetch('/api/test/create',{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tests:testData,testTitle,showCorrect,linkAccess})})
      .then(async(res)=>{
        if(res.ok){
          setActive(0)
        }
        else{
          setError("Произошла неизвестна ошибка при сохранении тест")
        }
      })
    }
  },[testTitle,showCorrect,setActive,characterLimitExceededTitle.length,characterLimitExceededVariant.length,linkAccess,validRecaptcha])

  const showCorrectAnswers = useCallback(()=>{
    setShowCorrect(prev=> !prev)
  },[])
  const changeLinkAccess = useCallback(()=>{
    setLinkAccess(prev => !prev)
  },[])

  const recaptcha = useCallback(()=>{
    setValidRecaptcha(true)
  },[])
  const expiredRecaptcha = useCallback(()=>{
    setValidRecaptcha(false)
  },[])

  return (
    <div>
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{ minHeight: "50vh", flexWrap: "nowrap" }}
      >
        <Grid sm={10} item>
          {step === 0 ? (
            <Paper elevation={7} style={{width:"100%",minHeight:"30vh",padding:"15px",margin:"3px",display:"flex",alignItems:"center"}}> 
            <FormControl fullWidth>
              <TextField
                inputRef={ref}
                fullWidth
                label="Название теста"
                variant="outlined"
              />
              <Button
                disabled={step === 1}
                onClick={addTitle}
                style={{ marginTop: "4px" }}
                variant="contained"
                color="primary"
              >
                Продолжить
              </Button>
              <small>Названиет теста от 5 до 120 символов</small>
            </FormControl>
            </Paper>
          ) : (
            <>
              {tests.length
                ? tests.map((test, i) => (
                  <Paper key={test.id} elevation={7} className={style.paper}>
                    <Box style={{ margin: "8px" }}>
                      <Toolbar style={{ padding: "0" }} variant="dense">
                        <Typography style={{ flexGrow: "1" }} variant="h6">
                          №{i + 1}
                        </Typography>
                        <Button
                          onClick={() => deleteQuestion(test.id)}
                          variant="contained"
                          color="secondary"
                          style={{ marginRight: "4px" }}
                        >
                          X
                        </Button>
                      </Toolbar>
                      <TextField onChange={(e)=>changeTestTitle(e,test.id)} margin="dense" fullWidth label="Вопрос" variant="outlined" />
                      {characterLimitExceededTitle.some(cr=>cr.id === test.id) && <small style={{color:"red"}}>Уменьньшите длину вопроса до 210 символов</small>}
                      <p style={{ margin: "4px" }}>Варианты ответа</p>
                      {testVariants.find(el=>el.testId === test.id).variants.map((variant, i) => (
                        <Box key={variant.id}>
                          <Toolbar style={{ padding: "0", margin: "0" }}>
                            <Tooltip title="Правильный ответ">
                             <FormControl>
                                 <FormControlLabel labelPlacement="bottom" label="Правильный" control={<Checkbox onChange={()=>setCorrectVariant(test.id,variant.id)} checked={testData.length && testData.find(el=> el.id === test.id).variants.find(vl=>vl.id === variant.id).correct} />}/>
                            </FormControl>
                            </Tooltip>
                            <div style={{display:"flex",flexDirection:"column"}}>
                            <TextField
                              onChange={(e)=>changeTestVariantTitle(e,test.id,variant.id)}
                              margin="dense"
                              label="Вариант ответа"
                              variant="outlined"
                            />
                            {characterLimitExceededVariant.some(cr=>cr.id === variant.id) && <small style={{color:"red"}}>Уменьшите длину варианта ответа до 150 символов</small>}
                            </div>
                            <div
                              onClick={() => deleteVariant(test.id, variant.id)}
                              style={{ cursor: "pointer", marginLeft: "4px",color:"red" }}
                            >
                              &#10296;
                            </div>
                          </Toolbar>
                        </Box>
                      ))}
                      <Button
                        onClick={() => addVariant(test.id)}
                        style={{
                          width: "10%",
                          padding: "5px",
                          marginTop: "8px",
                        }}
                        variant="outlined"
                        color="primary"
                      >
                        +
                      </Button>
                    </Box>
                    </Paper>
                  ))
                : ""}
              <Paper elevation={7} className={style.paper}>
              <FormControlLabel
                label="Показывать правильные ответы после завершения теста"
                control={<Checkbox checked={showCorrect} onChange={showCorrectAnswers} />}
              />
               <FormControlLabel
                label="Доступ только по ссылке"
                control={<Checkbox checked={linkAccess} onChange={changeLinkAccess} />}
              />
              <Button
                onClick={addQuestion}
                style={{ marginBottom: "4px" }}
                variant="contained"
                color="primary"
                fullWidth>
                Добавить вопрос
              </Button>
              {tests.length ? <Button variant="contained" onClick={createTest}  fullWidth style={{background:"lime", }}>Создать тест</Button>:""}
              <div style={{marginTop:"4px"}}><ReCAPTCHA sitekey="6LdCqbYbAAAAAKPcfcFUHPrEfBchHSOJlBaG3U0-" onExpired={expiredRecaptcha} onChange={recaptcha}/></div>
              {emptyTestTitle.length?<Alert variant="error">Пропущенно название вопроса {emptyTestTitle.map((em,i)=>(<span key={i} style={{marginLeft:"8px"}}>№{em}</span>))}</Alert>:""}
              {emptyVariantTitle.length ? <Alert variant="error">Пропущен{emptyVariantTitle.map((v,i)=>(<span key={i} style={{marginLeft:"8px"}}>вариант ответа <span style={{fontWeight:"900"}}>№{v.variant}</span> в вопросе <span style={{fontWeight:"900"}}>№{v.test}</span>,</span>))}</Alert>:""}
              {characterLimitExceededTitle.length? <Alert variant="error">В каком-то вопросе превышенно колличество символов</Alert>:""}
              {error ? <Alert variant="error">{error}</Alert>:""}
              </Paper>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default React.memo(Create)
