import {useContext} from 'react'
import Context from '../components/context/context'
import { Navigate } from 'react-router-dom'
const PrivateRoute = ({children}) =>{
    const context = useContext(Context)
    if(!context.auth){
        return <Navigate to="/login"/>
    }
    return children
}

export {PrivateRoute}