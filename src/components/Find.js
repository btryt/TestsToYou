import React,{useCallback, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import debounce from 'lodash.debounce'
import {Container,Grid,Paper,TextField,Typography} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
const Find = () =>{
    const ref = useRef()
    const [list,setList] = useState([])
    const [loading,setLoading] = useState(false)
    const [columns,setColumns] = useState([{field:"title",headerName:"Название",width:230,editable: false},
    {field:"url",headerName:"Ссылка",width:250,editable: false,renderCell:(params)=><Link to={`test/${params.value}`}>http://localhost/test/{params.value}</Link>}])
    const findTest = debounce((e)=>{
        if(e.target.value.trim() && e.target.value.trim().length <=120){
            setLoading(true)
            fetch(`/api/find/test?title=${e.target.value.trim()}`)
            .then(async res =>{
                let response = await res.json()
                if(res.ok) setList(response)
                setLoading(false)
            })
        }else setList([])
    },600)
    return (
    <main>
        <Container style={{marginTop:"4px"}}>
            <Grid container justify="center" alignItems="center">
                <Grid item style={{width:"100%"}}>
                    <Paper elevation={7} style={{minHeight:"50vh"}} >
                        <Typography variant="h6" style={{textAlign:"center"}}>Поиск тестов</Typography>
                        <Grid container justify="center">
                            <Grid item sm={5} >
                                <TextField inputRef={ref} onChange={findTest} margin="dense" fullWidth label="Название теста" variant="outlined"  />
                                <DataGrid loading={loading} pageSize={5} style={{height:"300px"}} columns={columns} rows={list}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </main>
    )
}

export default Find