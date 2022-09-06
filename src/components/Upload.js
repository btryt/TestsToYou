import React,{useCallback,useState,useMemo} from 'react'
import { Modal,Paper,Button, Container } from '@material-ui/core'
import uploadImg from '../assets/upload-24.png'
import uploadedImg from '../assets/uploaded-24.png'
const Upload = ({tests,setTests,setFormData}) =>{
    const [open,setOpen] = useState(false)
    const formData = useMemo(()=> new FormData(),[])

    const upload = useCallback(async(e,id,variantId)=>{   
        let extension = e.target.files[0]?.name.split(".").pop()
        if(!extension) return
        let testIndex = tests.findIndex(a=> a.id === id)
        if(variantId !== null){
            if(formData.has(`${id}-${variantId}`)){
                formData.delete(`${id}-${variantId}`)
            }
            formData.append(`${id}-${variantId}`,e.target.files[0],`${id}-${variantId}.${extension}`)
            
            if(testIndex !== -1 && tests.some(l=> l.id === id && l.variants.some(v=> v.id === variantId))){
                let arr = [...tests]
                let variantIndex = arr[testIndex].variants.findIndex(v=> v.id === variantId)
                if(variantIndex !== -1){
                    arr[testIndex].variants[variantIndex].img = true
                    
                    setTests(arr)
                }
            }
        }
        else{ 
            if(formData.has(`${id}`)){
                formData.delete(`${id}`)
            }
            formData.append(`${id}`,e.target.files[0],`${id}.${extension}`)
            
            if(testIndex !== -1 && tests.some(l=> l.id === id)){
                let arr = [...tests]
                arr[testIndex].img = true
                setTests(arr)
            }
        }
        setFormData(formData)
    },[formData,setFormData,tests,setTests])

    const removeData = useCallback((id,variantId)=>{
        let array = [...tests]
        let testIndex = tests.findIndex(l=> l.id === id)
        if(variantId !== null){
            if(formData.has(`${id}-${variantId}`)){
                formData.delete(`${id}-${variantId}`)
            }
            if(testIndex !== -1) {
                let variantIndex = tests[testIndex].variants.findIndex(v=> v.id === variantId)
                if(variantIndex !== -1){
                    array[testIndex].variants[variantIndex].img = false
                    setTests(array)
                }
            }
        }
        else{
            if(formData.has(`${id}`)){
                formData.delete(`${id}`)
            }
            let index = tests.findIndex(l=> l.id === id)
            if(index !== -1) {
                array[index].img = false
                setTests(array)
            }
        }
        setFormData(formData)
    },[tests,setTests,formData,setFormData])

    const openModal = useCallback(()=>{
        setOpen(true)
    },[])
    const closeModal = useCallback(()=>{
        setOpen(false)
    },[])
    
    return (
    <>
    <Button onClick={openModal} variant="contained" color="primary" style={{ marginBottom: "4px" }} fullWidth>Добавить изображение</Button>
    <Modal  onClose={closeModal} open={open} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Container maxWidth="md">
            <Paper className='upload__modal' style={{maxHeight:"400px",overflowY:"auto",padding:"8px"}}>
                <Container >
                {tests.map((test,testIndex)=>(
                <div key={test.id} style={{borderBottom:"1px solid black",margin:"2px"}}>
                   <div style={{display:"flex",justifyContent:"space-between"}}>
                       <span style={{wordBreak:"break-all"}}>№ {testIndex+1} {test.title}</span>
                     <div style={{display: !test.title.trim().length ? "none" : "flex", alignItems:"center"}}>
                           <label htmlFor={test.id + 1}><img style={{cursor:"pointer"}} src={test.img ? uploadedImg : uploadImg} alt="upload"/></label>
                           <input style={{display:"none"}} onChange={(e)=>upload(e,test.id,null)} id={test.id +1} type='file' />
                           
                           {test.img && <span onClick={()=> removeData(test.id,null)} style={{marginLeft:"12px",color:"red", cursor:"pointer"}}>X</span>}
                       </div>
                   </div> 
                   <ul>
                       {test.variants.map((variant,vIndex)=>(
                           <li key={variant.id}>
                               <div style={{display:!variant.title.trim().length ? "none":"flex",justifyContent:"space-between"}}>
                                    <span style={{wordBreak:"break-all", color: variant.correct && "lime"}}>{variant.title}</span>
                                     <div style={{display: !test.title.length ? "none" : "flex", alignItems:"center"}}>
                                        <label htmlFor={variant.id - 1}><img style={{cursor:"pointer"}} src={test.variants[vIndex].img ? uploadedImg : uploadImg} alt="upload"/></label>
                                        <input style={{display:"none"}} onChange={(e)=>upload(e,test.id,variant.id)} id={variant.id -1} type='file' />

                                        {test.variants[vIndex].img && <span onClick={()=> removeData(test.id,variant.id)} style={{marginLeft:"12px",color:"red", cursor:"pointer"}}>X</span>}
                                    </div>
                               </div>
                           </li>
                       ))}
                   </ul>
                </div>
                ))
            }
            <p>Формат картинки должен быть jpeg, jpg, png</p>
            <p>Максимальный размер картинки - 2МБ</p>
            </Container>
            </Paper>
        </Container>
    </Modal>
    </>
    )
}

export default React.memo(Upload)