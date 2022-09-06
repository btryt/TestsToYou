function funcWrapper(func,...args) {
    return ()=>{
        func(...args)
    }
}
export default funcWrapper