import React, { useCallback, useEffect, useState } from 'react';
import {  makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { DataGrid } from '@material-ui/data-grid';
import {Link, useNavigate} from 'react-router-dom'
import Results from './Results';
import NoRowsOverlay from './NoRowsOverlay'
import { Button } from '@material-ui/core';
import { useAuth } from '../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position:"relative",
    height: '420px',
    
    [theme.breakpoints.down('sm')]:{
       width:"100%",   
    }
  }
}));

function TestList() {
  const {setIsAuth} = useAuth()
  const classes = useStyles();
  const navigate = useNavigate()
  const [open,setOpen] =useState(false)
  const [testId,setTestId] = useState(null)
  const [loading,setLoading] =useState(false)
  const [rows,setRows] = useState([])
  const [selected, setSelected] = React.useState([]);
  const [columns,setColumns] = useState([{field:"title",headerName:"Название",width:250,editable: false},
    {field:"url",headerName:"Ссылка на тест",editable:false,width:260,renderCell:(params)=><Link style={{color:"white"}}  to={`../../test/${params.value}`}>http://localhost/test/{params.value}</Link>},
    {field:"Реузультат",headerName:"",width:180,editable: false, renderCell: (params)=> <Button style={{color:"white"}} onClick={()=>getResults(params.id)} variant="outlined" color="default">Информация</Button>}])


  const getTestsList = () =>{
    setLoading(true)
    fetch("/api/test/list",{method:"GET"})
    .then(async res =>{
      if(!res.ok){
        setIsAuth(false)
        navigate("/login",{replace:true})
        return  
      }
      let tests = await res.json()
      setRows([...tests])
      setLoading(false)
    })
  }

  useEffect(()=>{
    getTestsList()
  },[])
  const getResults = (id)=>{
    setOpen(true)
    setTestId(id)
  }

  const onSelected = (array)=>{
    if(array.length){
        setSelected(array)
    }
    else {
      setSelected([])
    }
}

const deleteTest = useCallback(() =>{
  fetch('/api/test/delete',{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(selected)})
  .then(async res=>{
    if(res.ok){
      getTestsList()
      setSelected([])
    }
  })
},[selected,setSelected])

  return (
    <Paper className={classes.root} >
      <DataGrid columns={columns} rows={rows} style={{marginTop:"40px"}} loading={loading} components={{NoRowsOverlay:NoRowsOverlay}} onSelectionModelChange={onSelected}  hideFooterSelectedRowCount pageSize={5} checkboxSelection disableSelectionOnClick />
      <Results open={open} id={testId} setOpen={setOpen}  />
      {selected.length ? <Button onClick={deleteTest} style={{position:"absolute",right:'5px',top:'2px'}} variant="contained" color="secondary"><span style={{fontSize:'23px'}}>&#128465;</span></Button>:""}
    </Paper>
  );
}
export default TestList