import React from 'react'
import TitleTest from '../components/TitleTest'
const WrappedComponent = React.forwardRef((props,ref) =>{
    
    return <TitleTest {...props} forwardRef={ref} />
})

export default WrappedComponent