import { Container, Grid,Paper,Typography } from '@material-ui/core'
import React from 'react'

const Home = () =>{
    
    return (
    <main>
        <Container style={{marginTop:"4px"}}>
            <Grid container justify="center" alignItems="center">
                <Grid item style={{width:"100%"}}>
                    <Paper className="change_theme" elevation={7} >
                        <Typography variant="h6" style={{textAlign:"center"}}>TestToYou</Typography>
                        <div  style={{padding:"4px"}}>Создай тест и поделись им</div>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </main>
    )
}

export default Home