import React from 'react'

const Alert = ({children,variant,style}) =>{
    
    return (
    <div style={{...style}} className={`alert ${variant || "ok"}`}>
        {children}
    </div>
    )
}

export default React.memo(Alert)