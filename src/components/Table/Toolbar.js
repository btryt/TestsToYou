import React, { useCallback } from 'react'
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Button} from '@material-ui/core'
const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }));
  
  const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, selected,setDeleted,setSelected } = props;
      const deleteTest = useCallback(() =>{
          fetch('/api/test/delete',{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(selected)})
          .then(async res=>{
            if(res.ok){
              let result = await res.text()
              setDeleted(result)
              setSelected([])
            }
          })
      },[selected,setDeleted,setSelected])
  
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h4" id="tableTitle" component="div">
            Ваши тесты
          </Typography>
        )}
  
        {numSelected > 0 ? (
          <>
            <Button onClick={deleteTest} variant="outlined">X</Button>
          </>
          
        ) : (
          <>
            <Button></Button>
          </>
        )}
      </Toolbar>
    );
  };
  
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    selected: PropTypes.array,
    setDeleted: PropTypes.func,
    setSelected: PropTypes.func
  };

  export default React.memo(EnhancedTableToolbar)