import React,{useCallback,useState, useEffect} from 'react'
import { Modal,Paper,Button, Container } from '@material-ui/core'
import defaultImg from '../assets/upload-24.png'
const Upload = ({tests,setTests,formData}) =>{
    const [open,setOpen] = useState(false)
    const [ref,setRef] = useState(null)

    const mountRef = useCallback((node)=>{
        if(node !== null) setRef(node)
    },[])

    const displayUploadedImg = useCallback(()=> {
        if (ref !== null){
            for (const key of formData.keys()) {
                const img = formData.get(key) 
                const output = ref.querySelector(`#id${key}`)
                output.src = URL.createObjectURL(img)
         }
        }
    },[formData,ref])

    useEffect(()=>{
        if (open) displayUploadedImg()
    },[open,displayUploadedImg])

    const upload = useCallback(async(e,id,variantId)=>{   
        const whiteList = ["jpg","jpeg","pjpeg","gif","png"]
        let extension = e.target.files[0]?.name.split(".").pop()

        if(!extension) return
        if(!whiteList.includes(extension)) return

        let testIndex = tests.findIndex(a=> a.id === id)
        if(variantId !== null){
            const testId_variantId = `${id}-${variantId}`

            if(formData.has(testId_variantId )){
                formData.delete(testId_variantId )
            }
            formData.append(testId_variantId ,e.target.files[0],`${testId_variantId}.${extension}`)
            
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
            if(formData.has(id)){
                formData.delete(id)
            }
            formData.append(id,e.target.files[0],`${id}.${extension}`)
            
            if(testIndex !== -1 && tests.some(l=> l.id === id)){
                let arr = [...tests]
                arr[testIndex].img = true
                setTests(arr)
            }
        }
        displayUploadedImg()
    },[formData,tests,setTests,displayUploadedImg])

    const removeData = useCallback((id,variantId)=>{
        let array = [...tests]
        let testIndex = tests.findIndex(l=> l.id === id)
        if(variantId !== null){
            const testId_variantId = `${id}-${variantId}`
            if(formData.has(testId_variantId)){
                formData.delete(testId_variantId)
            }
            if(testIndex !== -1) {
                let variantIndex = tests[testIndex].variants.findIndex(v=> v.id === variantId)
                if(variantIndex !== -1){
                    array[testIndex].variants[variantIndex].img = false
                    setTests(array)

                    const output = ref.querySelector(`#id${testId_variantId}`)
                    output.src = defaultImg
                }
            }
        }
        else{
            if(formData.has(id)){
                formData.delete(id)
            }
            let index = tests.findIndex(l=> l.id === id)
            if(index !== -1) {
                array[index].img = false
                setTests(array)

                const output = ref.querySelector(`#id${id}`)
                output.src = defaultImg
            }
        }
    },[tests,setTests,formData,ref])

    const openModal = ()=>{
        setOpen(true)
    }
    const closeModal = ()=>{
        setOpen(false)
    }
    
    return (
    <>
    <Button onClick={openModal} variant="contained" color="primary" style={{ marginBottom: "4px" }} fullWidth>Добавить изображение</Button>
    <Modal  onClose={closeModal} open={open} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Container maxWidth="md">
            <Paper ref={mountRef} className='upload__modal' style={{maxHeight:"400px",overflowY:"auto",padding:"8px"}}>
                <Container  >
                {tests.map((test,testIndex)=>(
                <div  key={test.id} style={{borderBottom:"1px solid black",margin:"2px"}}>
                   <div style={{display:"flex",justifyContent:"space-between"}}>
                       <span style={{wordBreak:"break-all"}}>№ {testIndex+1} {test.title}</span>
                     <div style={{display: !test.title.trim().length ? "none" : "flex", alignItems:"center"}}>
                           <label htmlFor={test.id + 1}>
                                <img className='img__display' id={`id${test.id}`} src={defaultImg} alt="upload"/>
                            </label>
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
                                        <label htmlFor={variant.id - 1}>
                                            <img className='img__display' id={`id${test.id}-${variant.id}`} src={defaultImg} alt="upload"/>
                                        </label>
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
            <p>Максимальный размер картинки - 1МБ</p>
            </Container>
            </Paper>
        </Container>
    </Modal>
    </>
    )
}

export default React.memo(Upload)