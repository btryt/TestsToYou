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
  Checkbox
} from "@material-ui/core"
import Alert from "./Alert"
import { useHistory } from "react-router-dom"
const Test = ({ match }) => {
  const history = useHistory()
  const [step,setStep] = useState(0)
  const [loaded,setLoaded] = useState(false)
  const [testId,setTestId] = useState(0)
  const [emptyAnswer,setEmptyAnswer] = useState(false) 
  const [title,setTitle] = useState("")
  const [correctAnswers,setCorrectAnswers] = useState([])
  const [tests, setTests] = useState([])
  const [error,setError] = useState("")
  const ref = useRef()
  useEffect(()=>{
      setLoaded(false)
      fetch(`/api/test/find/${match.params.url}`)
      .then(async res=>{
          if(res.ok){
              let response = await res.json()
              setTests([...response.rows.tests])
              setTitle(response.title)
              setTestId(response.testId)
          }
          else{
            history.replace("/")
          }
          setLoaded(true)
      })
  },[match.params.url,history])
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
          console.log('varI',variantIndex)
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
    setError("")
    if(ref.current.value.trim() && ref.current.value.trim().length <= 15 && correctAnswers.length){ 
      let name = ref.current.value.trim()
      localStorage.removeItem("answer")
      fetch("/api/test/finish",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({testId,name,answers:correctAnswers})})
      .then(async res=>{
        let response = await res.json()
        if(res.ok){
          
          history.replace(`/result/${response.url}`)
        }
        else{
          setError(response.message)
        }
      })
    }
  },[testId,correctAnswers,history])


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
            <Typography style={{ textAlign: "center",wordBreak:"break-word",padding:"5px 0 5px 0" }} variant="h5">
              {title}
            </Typography>
            </Paper>
            <>
                {tests.length && tests.map((test, i) => (
                  <Paper elevation={7} style={{width:"100%"}} key={test.id}>
                  <Box style={{ margin: "8px" }} >
                    <Toolbar variant="dense">
                      <Typography style={{wordBreak:"break-word"}} variant="h6">№{i + 1} {test.title}</Typography>
                    </Toolbar>
                    {test.variants.map((variant) => (
                      <Box key={variant.id}>
                        <Toolbar variant="dense">
                          <FormControl>
                            {!test.multiple ?
                            <Radio  color="default" onChange={()=>changeAnswer(test.id,variant.id)}  checked={correctAnswers.length ? correctAnswers.some(answer => answer.testId === test.id && answer.variants.some(v=> v.id === variant.id)):false} />
                            :<Checkbox  onChange={()=>changeAnswer(test.id,variant.id)} checked={correctAnswers.length ?correctAnswers.some(answer => answer.testId === test.id && answer.variants.some(v=> v.id === variant.id)) :false} />
                            }
                          </FormControl>
                          <span style={{wordBreak:"break-word"}}>{variant.title}</span>
                        </Toolbar>
                      </Box>
                    ))}
                  </Box>
                  </Paper>
                ))}
                {step === 0 &&<Button onClick={nextStep} fullWidth style={{justifyContent:"center"}} variant="contained" color="primary">Завершить тест</Button>}
                {emptyAnswer && <Alert variant="error">Вы ответили не на все вопросы</Alert>}
                {error && <Alert variant="error">{error}</Alert>}
              
            </>
          
        </Grid>:<Grid xs={12} item style={{textAlign:"center"}}><Paper elevation={7} style={{minHeight:"50vh"}}><CircularProgress style={{marginTop:"25vh"}}/></Paper></Grid>}
      </Grid>
    </Container>
  )
}

export default React.memo(Test)
