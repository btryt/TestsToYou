import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Modal, Paper,Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {DataGrid} from '@material-ui/data-grid'
import NoRowsOverlay from './NoRowsOverlay'



const useStyles = makeStyles((theme)=>({
    root:{
        width:"70%",
        position:"relative",
        [theme.breakpoints.down('sm')]:{
           width:"100%",
           margin: "10px"
        }
    }
}))
const Results = ({id,open,setOpen}) =>{
    const classes = useStyles()
    const [loading,setLoading] =useState(false)
    const [information, setInformation] = useState([])
    const [deleted,setDeleted] = useState(0)
    const [selected,setSelected] = useState([])
    const [results,setResults] = useState([])
    const [columns,setColumns] = useState([{field:"name",headerName:"Имя",width:150,editable: false},
    {field:"percentages",headerName:"Процент",width:150,editable: false,type: 'number'},
    {field:"result",headerName:"Результат",width:150,editable: false},
    {field:"finish_time",headerName:"Время завершения",width:220,editable: false},
    {field:"url",headerName:"Ссылка на результат",editable:false,width:260,renderCell:(params)=><Link style={{color:"white"}} to={`../../result/${params.value}`}>http://localhost/test/result/{params.value}</Link>}])
    
    useEffect(()=>{
        if(open){
            setLoading(true)
            fetch(`/api/test/results?id=${id}`)
            .then(async res=>{
                const data = await res.json()
                setResults(data.rows)
                setInformation([{averagePercentage:data.averagePercentage,numOfCompletedTest:data.numOfCompletedTest,averageRating:data.averageRating}])
                setLoading(false)
            })
        }
    },[id,open,deleted])
    const onClose = useCallback(()=>{
        setOpen(false)
        setResults([])
        setSelected([])
    },[setOpen])

    const onSelected = useCallback((id)=>{
        if(id.length){
            id.forEach(i=>{
                let {testid} = results.find(el=> el.id === i)
                setSelected(prev=> [...prev,{id:i,testid}])
            })
        }else{
            setSelected(id)
        }
    },[results])

    const deleteResult = useCallback(()=>{
        if(selected.length){
            fetch("/api/test/result/delete",{method:"POST",body:JSON.stringify(selected),headers:{
                "Content-Type":"application/json"
            }})
            .then(async res=>{
                if(res.ok) setDeleted(await res.text())
            })
        }
    },[selected])
    
    return (
    <Modal style={{display:"flex",justifyContent:"center",alignItems:"center"}} onClose={onClose} open={open}>
        <Paper className={classes.root}  >
         {selected.length ? <Button onClick={deleteResult} style={{position:"absolute",right:'3px',top:'3px'}} variant="contained" color="secondary">Удалить результат</Button>:""}
            <DataGrid components={{NoRowsOverlay:NoRowsOverlay}} style={{height:"420px",marginTop:"40px"}} loading={loading} hideFooterSelectedRowCount onSelectionModelChange={onSelected} rows={results} columns={columns} pageSize={5} checkboxSelection disableSelectionOnClick/>
            {information.map((info,i)=>(
                <div key={i} style={{display:'flex',flexDirection:'column',margin:"4px"}}>
                    <span>Средний процент: {info.averagePercentage}</span>
                    <span>Колличество пройденных: {info.numOfCompletedTest}</span>
                    <span>Рейтинг теста: {info.averageRating}</span>
                </div>
            ))}
        </Paper> 
    </Modal>
    )
}

export default React.memo(Results)