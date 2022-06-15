import React  from 'react'
import {
    Container,
    Grid,
    Typography,
} from "@material-ui/core"


  
  const NotFound = () =>{
    
    return (
    <Container maxWidth="lg" style={{minHeight:"93vh",display:"flex"}}>
        <Grid container alignContent='center' justify="center">
            <Grid item >
                <Typography variant='h1' align='center' style={{color:"#C0C0C0"}}>404</Typography> 
                <Typography variant='h4' align='center' style={{color:"#C0C0C0"}}>Страница не найдена</Typography>
            </Grid>
        </Grid>

    </Container>
    )
  }
  
  export default NotFound