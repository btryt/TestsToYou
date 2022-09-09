import React, { useRef, useState, useCallback, useEffect, useMemo } from "react"
import debounce from 'lodash.debounce'
import Upload from "./Upload"
import {
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@material-ui/core"
import {  makeStyles} from '@material-ui/core/styles';
import Alert from './Alert'
import TitleTestForwardREf from '../HOC/TitleTestForwardREf'
import ReCAPTCHA from "react-google-recaptcha"
import { FixedSizeList } from "react-window";
import TestRow from "./TestRow";
import { useNavigate } from "react-router-dom";
const useStyle = makeStyles((theme)=>({
  paper:{
    padding: theme.spacing(1),
    margin:theme.spacing(1)
  },
  block:{
    marginTop:"4px",
    display:"flex",
    flexDirection:"column",
    width:"70%",
    [theme.breakpoints.down('sm')]: {
      width:"100%"
    },
  }
}))

const Create = () => {
  const style = useStyle()
  const navigate = useNavigate()
  const [tests, setTests] = useState([{
    id:new Date().getTime(),
    title:"",
    multiple:false,
    img:false,
    variants:[{id:new Date().getTime() * Math.round(Math.random() * 20) + 1,title:"",correct:true,img:false}]
  }])
  const [hideInput,setHideInput] = useState(false)
  const [continueTest,setContinueTest] = useState(false)
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
  const [waitFetchComplite,setWaitFetchComplite] =useState(false)
  const formData = useMemo(()=> new FormData(),[])
  const ref = useRef()

  useEffect(()=>{
    if(JSON.parse(localStorage.getItem("saved_test"))?.tests.length){
      setHideInput(true)
    }
  },[])

  useEffect(()=>{
    if(continueTest){
      let savedTest = JSON.parse(localStorage.getItem("saved_test"))
      setTests(savedTest.tests)
      setTestTitle(savedTest.testTitle)
      setLinkAccess(savedTest.linkAccess)
      setShowCorrect(savedTest.showCorrect)

      setStep(1)
    }
  },[continueTest])

  const addTitle = () => {
    if (ref.current.value.trim() && ref.current.value.trim().length <= 110 && ref.current.value.trim().length >= 5) {
      setTestTitle(ref.current.value.trim())
      setStep((prev) => prev + 1)
    }
  }
  
  const changeTestTitle = debounce((e,id)=>{
      let array = [...tests]
      let testIndex = array.findIndex((test) => test.id === id)
      if(e.target.value.trim().length >=110){
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
        array[testIndex].title = e.target.value.trim()

        setTests(array)
        
      }
  },300)
  const addQuestion = useCallback(() => {
    if(tests.length+1 <= 40){
      const id = new Date().getTime()
      const variantId = new Date().getTime() * Math.round(Math.random() * 20) + 1

      setTests((prev) => [
        ...prev,
        {
          id,
          title:"",
          multiple:false,
          img:false,
          variants:[{id:variantId,title:"",correct:true,img:false}]
        },
      ])
  }
  }, [tests.length])

  const deleteFormData = useCallback((array,testIndex,id) =>{
    if(formData.has(id)){
      formData.delete(id)
    }
      if(array[testIndex].variants.some(v=> v.img)){
        array[testIndex].variants.forEach(v=>{
          let testVariantId = `${id}-${v.id}`
          if(formData.has(testVariantId)){
            formData.delete(testVariantId)
          }
        })
      }
  },[formData])

  const deleteQuestion = useCallback(
    (id) => {
      let array = [...tests]
      let testIndex = array.findIndex((test) => test.id === id)
      
      deleteFormData(array,testIndex,id)

      array.splice(testIndex,1)
      setTests(array)
    },
    [tests,deleteFormData]
  )

  const addVariant = useCallback((id) => {
      let variantId = new Date().getTime()
      let array = [...tests]
      let testIndex = array.findIndex((test) => test.id === id)
      
      if(array[testIndex].variants.length === 4) return

      array[testIndex].variants.push({id: variantId, title: "", correct: false,img:false})
      setTests(array)
    },
    [tests]
  )
  const deleteVariant = useCallback(
    (id, variantId) => {
      let array = [...tests]
      let testIndex = array.findIndex((test) => test.id === id)
      let variantIndex = array[testIndex].variants.findIndex(v=>v.id === variantId)
      if(array[testIndex].variants.filter((el)=>el.correct === true).length < 2 && array[testIndex].variants.length > 1 && array[testIndex].variants[variantIndex].correct) return 
      
      if(array[testIndex].variants.length === 1) return

      array[testIndex].variants.splice(variantIndex, 1)
      array[testIndex].multiple = array[testIndex].variants.filter(v=> v.correct === true).length > 1 ? true : false
      
      setTests(array)

      if(formData.has(`${id}-${variantId}`)){
        formData.delete(`${id}-${variantId}`)
      }
    },
    [tests,formData]
  )
  const setCorrectVariant = useCallback((id,variantId)=>{
    let array = [...tests]
    
    let testIndex = array.findIndex((test) => test.id === id)
    let variantIndex = array[testIndex].variants.findIndex( (variant) => variant.id === variantId)
    if(array[testIndex].variants.filter((el)=>el.correct === true).length < 2 && array[testIndex].variants.length > 1 && array[testIndex].variants[variantIndex].correct) return 

    if(array[testIndex].variants.length > 1){ 
      array[testIndex].variants[variantIndex].correct = !array[testIndex].variants[variantIndex].correct
      
    }
    array[testIndex].multiple = array[testIndex].variants.filter((el)=>el.correct === true).length > 1 ? true : false
   
    setTests(array)
    
  },[tests])
    
  const changeTestVariantTitle = debounce((e,id,variantId)=>{
      let array = [...tests]
      let testIndex = array.findIndex((test) => test.id === id)
      let variantIndex = array[testIndex].variants.findIndex( (variant) => variant.id === variantId)
      if(e.target.value.trim().length >= 90){
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
        array[testIndex].variants[variantIndex].title = e.target.value.trim()

        setTests(array)
      }
  },300)

  const createTest = useCallback(()=>{
    let isEmpty = false  
    setError(null)
    setEmptyTestTitle([])
    setEmptyVariantTitle([])
    tests.forEach((test,index)=>{
      if(!test.title.trim()){
        isEmpty = true
        setEmptyTestTitle(prev => [...prev,index+1])
      }
      test.variants.forEach((variant,i)=>{
        if(!variant.title.trim()){
          isEmpty = true
          setEmptyVariantTitle(prev=>[...prev,{test:index+1,variant:i+1}])
        }
      })
    })
    if(!characterLimitExceededTitle.length && !characterLimitExceededVariant.length && !isEmpty && validRecaptcha && !waitFetchComplite ){
      setWaitFetchComplite(true)
      fetch('/api/test/create',{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tests:tests,testTitle,showCorrect,linkAccess})})
      .then(async(res)=>{
        if(res.ok){
           if(formData) {
            let response = await fetch("/api/upload",{method:"POST",body:formData})
            if(!response.ok){
              const {message} = await response.json()
              setError(message)
              return
            }
          }
          navigate('../test/list',{replace:true})
      }
        else{
          setError("Произошла неизвестна ошибка при создании теста")
        }
    }).finally(()=>{
      setWaitFetchComplite(false)
    })
    }
  },[testTitle,formData,showCorrect,characterLimitExceededTitle.length,characterLimitExceededVariant.length,linkAccess,validRecaptcha,tests,waitFetchComplite])


  const saveTest = ()=>{
    localStorage.setItem("saved_test",JSON.stringify({tests,linkAccess,showCorrect,testTitle,testData:tests}))
  }

  const continueTestHandler = ()=>{
    setContinueTest(true)
  }

  const deleteSavedTest = ()=>{
    localStorage.removeItem("saved_test")

    setHideInput(false)
  }

  const showCorrectAnswers =()=>{
    setShowCorrect(prev=> !prev)
  }
  const changeLinkAccess =()=>{
    setLinkAccess(prev => !prev)
  }

  const recaptcha = ()=>{
    setValidRecaptcha(true)
  }
  const expiredRecaptcha = ()=>{
    setValidRecaptcha(false)
  }

  useEffect(()=>{
    if(error){
      setTimeout(()=>{
        setError(null)
      },10000)
    }
  },[error])
  return (
    <>
    {step === 0 ? (
            <TitleTestForwardREf 
            hideInput={hideInput} 
            ref={ref} step={step} 
            addTitle={addTitle} 
            styleBlock={style.block} continueTestHandler={continueTestHandler} deleteSavedTest={deleteSavedTest} />
      ) 
        :
  
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{ minHeight: "50vh", flexWrap: "nowrap" }}
      >
        <Grid sm={10} item>
            <>
                <FixedSizeList itemData={{deleteQuestion,
                  tests,
                  continueTest,
                  characterLimitExceededTitle,
                  changeTestVariantTitle,
                  characterLimitExceededVariant,
                  deleteVariant,
                  addVariant,
                  changeTestTitle,
                  setCorrectVariant,
                }} 
                className="test__list"
                style={{minHeight:"400px",width:"100%",marginTop:"16px",overflowX:"hidden"}}
                
                height={600} width={500}
                itemCount={tests.length} itemSize={470}>

                  {TestRow}

                </FixedSizeList>
                
              <Paper elevation={7} className={style.paper}>
              <div style={{display:"flex",flexDirection:"column"}}>
              <FormControlLabel
                label="Показывать правильные ответы после завершения теста"
                control={<Checkbox checked={showCorrect} onChange={showCorrectAnswers} />}
                
                />
               <FormControlLabel
                label="Доступ только по ссылке"
                control={<Checkbox checked={linkAccess} onChange={changeLinkAccess} />}
                
              />
              </div>
              <Button
                onClick={addQuestion}
                style={{ marginBottom: "4px" }}
                variant="contained"
                color="primary"
                fullWidth>
                Добавить вопрос
              </Button>
              {tests.length ? <Upload setError={setError} tests={tests} setTests={setTests} formData={formData} />:""}
              {tests.length ? 
                <Button onClick={saveTest} fullWidth style={{marginBottom:"4px"}}  variant="contained" color="primary">Сохранить тест</Button>
                :""}
              {tests.length ? <Button variant="contained" onClick={createTest}  fullWidth style={{background:"lime", }}>Создать тест</Button>:""}
              {tests.length ? <div><ReCAPTCHA sitekey="6LdCqbYbAAAAAKPcfcFUHPrEfBchHSOJlBaG3U0-" onExpired={expiredRecaptcha} onChange={recaptcha}/></div>:""}
              {emptyTestTitle.length?<Alert variant="error">Пропущенно название вопроса {emptyTestTitle.map((em,i)=>(<span key={i} style={{marginLeft:"8px"}}>№{em}</span>))}</Alert>:""}
              {emptyVariantTitle.length ? <Alert variant="error">Пропущен{emptyVariantTitle.map((v,i)=>(<span key={i} style={{marginLeft:"8px"}}>вариант ответа <span style={{fontWeight:"900"}}>№{v.variant}</span> в вопросе <span style={{fontWeight:"900"}}>№{v.test}</span>,</span>))}</Alert>:""}
              {characterLimitExceededTitle.length? <Alert variant="error">В каком-то вопросе превышенно колличество символов</Alert>:""}
              {error ? <Alert variant="error">{error}</Alert>:""}
              </Paper>
            </>
        </Grid>
      </Grid>
     
      } </>    
  )
}

export default Create
