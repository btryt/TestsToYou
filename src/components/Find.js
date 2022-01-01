import React,{useCallback, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import debounce from 'lodash.debounce'
import {Container,Grid,Paper,TextField,Typography} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
const Find = () =>{
    const ref = useRef()
    const [list,setList] = useState([])
    const [title,setTitle] = useState('')
    const [numberOfRows,setNumberOfRows] = useState(0)
    const [pagesList,setPagesList] = useState(new Set())
    const [hasNextPage,setHasNextPage] = useState(false)
    const [loading,setLoading] = useState(false)
    const [columns,setColumns] = useState([{field:"title",headerName:"Название",width:230,editable: false},
    {field:"url",headerName:"Ссылка",width:250,editable: false,renderCell:(params)=><Link style={{color:"white"}} to={`test/${params.value}`}>http://localhost/test/{params.value}</Link>}])
    
    const findTest = debounce((e)=>{
        if(e.target.value.trim() && e.target.value.trim().length <=120){
            setLoading(true)
            setPagesList(new Set())
            setList([])
            fetch(`/api/find/test?title=${e.target.value.trim()}&c=${0}`)
            .then(async res =>{
                let response = await res.json()
                if(res.ok) {
                    setNumberOfRows(response.numberOfRows)
                    if(response.numberOfRows !== 0 && response.numberOfRows > 5 && (response.rows.length % 5 === 0) ){
                        setList([...response.rows,{id:new Date().getTime(),title:"",url:""}])
                        setHasNextPage(true)
                    }
                    else {
                        setList([...response.rows])
                    }
                }
                setLoading(false)
                setTitle(e.target.value.trim())
            })
        }else setList([])
    },600)

    const uploadingHandler = useCallback((p)=>{
        let up = p === 0 ? 1: p + 1
        if(up > 1 && hasNextPage && !pagesList.has(p)){
            pagesList.add(p)
            setLoading(true)
            fetch(`/api/find/test?title=${title}&c=${up}`)
            .then(async res =>{
                let response = await res.json()
                if(res.ok){
                    if(response.numberOfRows !== 0 && response.numberOfRows > 5 &&  (response.rows.length % 5 === 0) && response.rows.length !== response.numberOfRows ){
                        setList([...response.rows,{id:new Date().getTime(),title:"",url:""}])
                        setHasNextPage(true)
                    }
                    else {
                        setList([...response.rows])
                        setHasNextPage(false)
                    }
                }
                setLoading(false)
            })
    }
    
    },[title,hasNextPage,pagesList])

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
                                <DataGrid onPageChange={(p)=> uploadingHandler(p.page)} loading={loading} pageSize={5} style={{height:"300px"}} columns={columns} rows={list}/>
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