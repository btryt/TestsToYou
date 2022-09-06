import React from "react"
import { useMemo } from "react"
import {
  TextField,
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
import funcWrapper from "../utils/funcWrapper"
import funcOnChangeWrapper from "../utils/funcOnChangeWrapper"
const TestRow = ({
  index,
  style,
  data: {
    deleteQuestion,
    tests,
    continueTest,
    characterLimitExceededTitle,
    changeTestVariantTitle,
    characterLimitExceededVariant,
    deleteVariant,
    addVariant,
    changeTestTitle,
    setCorrectVariant,
  },
}) => {
  const test = useMemo(() => tests[index], [tests, index])
 
  return (
    <Paper style={{...style,padding:"4px",height:style.height - 10,margin:"8px"}} elevation={7}>
      <Box style={{ margin: "8px"}}>
        <Toolbar style={{ padding: "0" }} variant="dense">
          <Typography style={{ flexGrow: "1" }} variant="h6">
            №{index + 1}
          </Typography>
          <Button
            onClick={funcWrapper(deleteQuestion, test.id)}
            variant="contained"
            color="secondary"
            style={{ marginRight: "4px" }}
          >
            X
          </Button>
        </Toolbar>
        <TextField
        InputLabelProps={{
            style:{color:"white"}
        }}
          defaultValue={
            continueTest ? tests.find((t) => t.id === test.id).title : test.title
          }
          
          onChange={funcOnChangeWrapper(changeTestTitle, test.id)}
          margin="dense"
          fullWidth
          label="Вопрос"
          variant="outlined"
        />
        {characterLimitExceededTitle.some((cr) => cr.id === test.id) && (
          <small style={{ color: "red" }}>
            Уменьньшите длину вопроса до 110 символов
          </small>
        )}
        <p style={{ margin: "4px" }}>Варианты ответа</p>
        {tests[index].variants.map((variant, i) => (
          <Box key={variant.id} >
            <Toolbar style={{ padding: "0", margin: "0"}}>
              <Tooltip title="Правильный ответ">
                <FormControl >
                  <FormControlLabel
                  
                    labelPlacement="bottom"
                    label="Правильный"
                    control={
                      <Checkbox
                        onChange={funcWrapper(
                          setCorrectVariant,
                          test.id,
                          variant.id
                        )}
                        checked={
                          tests.length &&
                          tests
                            .find((el) => el.id === test.id)
                            .variants.find((vl) => vl.id === variant.id).correct
                        }
                      />
                    }
                  />
                </FormControl>
              </Tooltip>
              <div style={{ display: "flex", flexDirection: "column",width:"60%" }}>
                <TextField
                    InputLabelProps={{
                        style:{color:"white"}
                    }}
                  onChange={funcOnChangeWrapper(
                    changeTestVariantTitle,
                    test.id,
                    variant.id
                  )}
                  margin="dense"
                  label="Вариант ответа"
                  variant="outlined"
                  defaultValue={
                    continueTest
                      ? tests
                          .find((t) => t.id === test.id)
                          .variants.find((v) => v.id === variant.id).title
                      : ""
                  }
                />
                {characterLimitExceededVariant.some(
                  (cr) => cr.id === variant.id
                ) && (
                  <small style={{ color: "red" }}>
                    Уменьшите длину варианта ответа до 90 символов
                  </small>
                )}
              </div>
              <div
                onClick={funcWrapper(deleteVariant, test.id, variant.id)}
                style={{ cursor: "pointer", marginLeft: "4px", color: "red" }}
              >
                &#10296;
              </div>
            </Toolbar>
          </Box>
        ))}
        <Button
          onClick={funcWrapper(addVariant, test.id)}
          style={{
            width: "10%",
            padding: "5px",
            marginTop: "8px",
          }}
          variant="contained"
          color="primary"
        >
          +
        </Button>
      </Box>
    </Paper>
  )
}

export default TestRow
