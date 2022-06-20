import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  Box,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
  Radio,
  FormControl,
  Button,
  Modal,
  TextField,
  CircularProgress,
  Checkbox,
  
} from "@material-ui/core"
import Rating from './Rating'
import Alert from "./Alert"
import { useNavigate,useParams } from "react-router-dom"
import funcWrapper from "../func/funcWrapper";
import isCorrect from "../func/isCorrect";
const Test = () => {
  const location = useNavigate()
  const params = useParams()
  const [step,setStep] = useState(0)
  const [loaded,setLoaded] = useState(false)
  const [testId,setTestId] = useState(0)
  const [userLogin,setUserLogin] = useState("")
  const [emptyAnswer,setEmptyAnswer] = useState(false) 
  const [title,setTitle] = useState("")
  const [correctAnswers,setCorrectAnswers] = useState([])
  const [tests, setTests] = useState([])
  const [errorMessage,setErrorMessage] = useState("")
  const ref = useRef()
  
  useEffect(()=>{
      let mounted = true
      setLoaded(false)
      fetch(`/api/test/find/${params.url}`)
      .then(async res=>{
        if(mounted){
          if(res.ok){
              let response = await res.json()
              setTests([...response.rows.tests])
              setTitle(response.title)
              setUserLogin(response.userLogin)
              setTestId(response.testId)
          }
          else{
            location("../find",{replace:true})
          }
          setLoaded(true)
        }
        })
        return ()=> mounted = false
  },[params.url,location])
  
  useEffect(()=>{
    if(localStorage.getItem("answer")){
      let answers = JSON.parse(localStorage.getItem("answer"))
      
      if(answers && tests.length){
        answers.forEach(val=>{
          if(val.testId === tests.find(el=> el.id === val.testId)?.id){
            setCorrectAnswers(JSON.parse(localStorage.getItem("answer")))
          }
        })
    }
    }
  },[tests])

  const changeAnswer = useCallback((testId,variantId)=>{
    let array = [...correctAnswers]
    let testIndex = tests.findIndex(t=> t.id === testId)
    
    if(correctAnswers.length){
      let index = correctAnswers.findIndex(el=> el.testId === testId)
      
      if(index !== -1){
        let variantIndex = array[index].variants.findIndex(el=>el.id === variantId)
        if(tests[testIndex].multiple){
  
          if(variantIndex !== -1){
          if(array[index].variants.filter(el=>el.correct===true).length > 1 && array[index].variants[variantIndex].correct){

            array[index].variants.splice(variantIndex,1)
          }
        }
        else{
          array[index].variants.push({id:variantId,correct: true})
        }
      }
      else {
        array[index].variants.splice(variantIndex,1)
        array[index].variants.push({id:variantId,correct:true})
      }
      }
      else{
        array.push({testId:testId,variants:[{id:variantId,correct: true}]})
      }
    }
    else{
      array.push({testId:testId,variants:[{id:variantId,correct: true}]})
    }
      setCorrectAnswers(array)
      localStorage.setItem("answer",JSON.stringify(array))
      
  },[correctAnswers,tests])

  const nextStep = useCallback(()=>{
    setEmptyAnswer(false)
    if((tests.length === correctAnswers.length) && correctAnswers.length){
      return setStep(1)
    }
    setEmptyAnswer(true)
  },[tests.length,correctAnswers.length])

  const finishTest = useCallback(()=>{
    setErrorMessage("")
    if(ref.current.value.trim() && ref.current.value.trim().length <= 15 && correctAnswers.length){ 
      let name = ref.current.value.trim()
      localStorage.removeItem("answer")
      fetch("/api/test/finish",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({testId,name,answers:correctAnswers})})
      .then(async res=>{
        let response = await res.json()
        if(res.ok){
          location(`/result/${response.url}`,{replace:true})
        }
        else{
          setErrorMessage(response.message)
        }
      })
    }
  },[testId,correctAnswers,location])


  return (
    <Container style={{ marginTop: "4px" }}>
      <Modal style={{display:"flex",justifyContent:"center",alignItems:"center"}} onClose={()=>setStep(0)} open={step === 1}>
        <Paper style={{minHeight:"120px",padding:"14px",margin:"6px"}}>
        <TextField inputRef={ref} style={{marginTop:"5px"}} fullWidth label="Ваше имя"/>
        <Button fullWidth onClick={finishTest} style={{marginTop:"6px"}} color="primary" variant="contained">Завершить тест</Button>
        <small>Максимум 15 символов</small>
        </Paper>
      </Modal>
      <Grid  container>
       {loaded ?<Grid xs={12} item>
            <Paper elevation={7}>
              <Box flexDirection="column">
            <Typography style={{ textAlign: "center",wordBreak:"break-word",padding:"5px 0 5px 0" }} variant="h5">
              {title}
            </Typography>
            <Typography style={{ textAlign: "center",wordBreak:"break-word",padding:"5px 0 5px 0" }} variant="h6">
             Тест создан: {userLogin}
            </Typography>
              </Box>
            </Paper>
            <>
                {tests.length && tests.map((test, i) => (
                  <Paper elevation={7} style={{width:"100%"}} key={test.id}>
                  <Box style={{ margin: "8px" }} >
                    <Toolbar  variant="dense">
                      <div style={{display:"flex", flexDirection:"column",borderLeft:"4px solid #3f51b5",padding:"12px",margin:"4px"}}>
                      <Typography style={{wordBreak:"break-word"}} variant="h6">№{i + 1} {test.title}</Typography>
                      {test.img && <img className="test_image" src={`http://localhost:4000/image/${testId}/${test.id}`} alt="img"/>}
                      </div>
                    </Toolbar>
                    {test.variants.map((variant) => (
                      <Box style={{margin:"4px"}} key={variant.id}>
                        <Toolbar variant="dense"  >
                        
                          <FormControl style={{flexShrink:0}}>
                            {!test.multiple ?
                            <Radio  color="secondary" onChange={funcWrapper(changeAnswer,test.id,variant.id)}  checked={isCorrect(correctAnswers,test,variant)} />
                            :<Checkbox  onChange={funcWrapper(changeAnswer,test.id,variant.id)} checked={isCorrect(correctAnswers,test,variant)} />
                            }
                          </FormControl>
                          <div style={{display:"flex", flexDirection:"column"}}> 
                          <span style={{wordBreak:"break-word",marginBottom:"4px"}}>{variant.title}</span>
                            {variant.img && <img className="variant_image" src={`http://localhost:4000/image/${testId}/${test.id}-${variant.id}`} alt="img"/>}
                          </div>
                          
                        </Toolbar>
                      </Box>
                    ))}
                  </Box>
                  </Paper>
                ))}
                {step === 0 &&<Button onClick={nextStep} fullWidth style={{justifyContent:"center"}} variant="contained" color="primary">Завершить тест</Button>}
                <Paper style={{marginTop:"8px",display:"flex",justifyContent:"center"}}>
                  <div style={{display:"flex",flexDirection:"column"}}>
                    <Typography variant="h6">Рейтинг теста</Typography>
                    <Rating testId={testId} setErrorMessage={setErrorMessage} />
                  </div>
                </Paper>
                {emptyAnswer && <Alert variant="error">Вы ответили не на все вопросы</Alert>}
                {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
            </>
        </Grid>:<Grid xs={12} item style={{textAlign:"center"}}><Paper elevation={7} style={{minHeight:"50vh"}}><CircularProgress style={{marginTop:"25vh"}}/></Paper></Grid>}
      </Grid>
    </Container>
  )
}

export default React.memo(Test)
