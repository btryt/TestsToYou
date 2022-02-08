import React from 'react'
import {
    TextField,
    Button,
    FormControl,
    Paper,
  } from "@material-ui/core"
const TitleTest = ({hideInput,forwardRef,step,addTitle,styleBlock,continueTestHandler,deleteSavedTest}) =>{
    return (
        <Paper elevation={7} style={{width:"100%",minHeight:"30vh",padding:"15px",margin:"3px",display:"flex",alignItems:"center",flexDirection:"column",justifyContent:"center"}}> 
        {!hideInput ? <FormControl fullWidth>
          <TextField
            inputRef={forwardRef}
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
          <small>Названиет теста от 5 до 110 символов</small>
        </FormControl> :
        <div className={`change_theme ${styleBlock}`} >
          <span>У вас есть сохраненный тест <b>{JSON.parse(localStorage.getItem('saved_test')).testTitle}</b>, хотите продолжить его?</span>
          <Button onClick={continueTestHandler} style={{margin:"4px"}} variant="contained" color="primary" >Да</Button>
          <Button onClick={deleteSavedTest} style={{margin:"4px"}} variant="contained" color="secondary" >Нет</Button>
        </div>
        }
        </Paper>
    )
}

export default React.memo(TitleTest)