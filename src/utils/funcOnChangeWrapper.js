function funcOnChangeWrapper(func,...args){
    return (e) => func(e,...args) 
}

export default funcOnChangeWrapper