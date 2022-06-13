import React,{useCallback,useEffect,useState,useMemo} from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal,Paper,Button, Container } from '@material-ui/core'
import uploadImg from '../assets/upload-24.png'
import uploadedImg from '../assets/uploaded-24.png'
const Upload = ({list,successfulCreation,setActive,setError,pressed,setPressed,getData,setSuccessfulCreation}) =>{
    const navigate = useNavigate()
    const [open,setOpen] = useState(false)
    const [imgList,setimgList] = useState([])
    const formData = useMemo(()=> new FormData(),[])

    const filterData = useCallback(()=>{
        let array = JSON.parse(JSON.stringify(imgList))
        let testData = JSON.parse(JSON.stringify(list))
        
        if(imgList.length){

            list.forEach((x,index,thisArr)=>{
                array.forEach((a,i)=>{
                    if(!thisArr.find(t=> t.id === a.id)){
                        if(!formData.has(array[i].id)){
                            formData.delete(array[i].id)
                        }
                        array.splice(i,1)
                    }else{
                     a.variants.forEach((v,idx)=>{
                         if(!thisArr.find(t=> t.id === a.id)?.variants.find(vr=> vr.id === v)){
                             if(!formData.has(`${array[i]}-${array[i].variants[idx]}`)){
                                 formData.delete(`${array[i]}-${array[i].variants[idx]}`)
                             }
                             array[i].variants.splice(idx,1)
                         }
                     })  
                    }
                })
            })

            testData.forEach((v,i)=>{
                if(array.find(a=> a.id === v.id)?.img){
                    testData[i].img = true
                }
                else testData[i].img = false

                testData[i].variants.forEach((vr,idx)=>{
                    if(array.find(a=> a.id === v.id)?.variants.find(variant=> variant === vr.id)){
                        testData[i].variants[idx].img = true
                    }
                    else testData[i].variants[idx].img = false
                })
            })
            
            for(let val of formData.keys()){
                if(!val.includes("-")){
                    if(!list.find(l=>l.id == val)){
                        formData.delete(val)
                    }
                }
                else{
                    let id = val.split("-")
                    if(!list.find(l=>l.id == id[0])){
                        formData.delete(val)
                    }
                    else if(!list.find(l=> l.id == id[0])?.variants.find(v=> v.id == id[1])){
                        formData.delete(`${id[0]}-${id[1]}`)
                    }
                }
            }
            return testData
        }
    },[formData,imgList,list])
    
    const send = useCallback(async()=>{
        try{
            if(imgList.length){
            let response = await fetch("/api/upload",{method:"POST",body:formData})
            if(response.ok){
                navigate('../test/list',{replace:true})
            }else {
                let errorMessage = await response.text()
                setPressed(false)
                setSuccessfulCreation(false)
                setError(errorMessage)
            }
        }
        }
        catch(e){
            setPressed(false)
            setError(e)
        }
    },[formData,setError,setPressed,imgList,setSuccessfulCreation,navigate])


    const upload = useCallback(async(e,id,variantId)=>{   
        let extension = e.target.files[0]?.name.split(".").pop()
        if(!extension) return
        if(variantId !== null){
            if(formData.has(`${id}-${variantId}`)){
                formData.delete(`${id}-${variantId}`)
            }
            formData.append(`${id}-${variantId}`,e.target.files[0],`${id}-${variantId}.${extension}`)
        }
        else{ 
            if(formData.has(`${id}`)){
                formData.delete(`${id}`)
            }
            formData.append(`${id}`,e.target.files[0],`${id}.${extension}`)
        }

        if(imgList.some(obj=> obj.id === id)){
            let array = [...imgList] 
            let index = array.findIndex(val => val.id === id)
            if(variantId === null) array[index].img = true

            if(variantId !== null && !array[index].variants.some(el=> el === variantId)){
               array[index].variants.push(variantId)
            }
            setimgList(array)
        }
        else{
            if(variantId !== null){
                setimgList(prev=> [...prev,{id:id,variants:[variantId],img:false}])
            }
            else setimgList(prev=> [...prev,{id:id,variants:[],img:true}])
        }

    },[imgList,formData])

    const removeData = useCallback((id,variantId)=>{
        let array = JSON.parse(JSON.stringify(imgList))
        if(variantId !== null){
            if(formData.has(`${id}-${variantId}`)){
                formData.delete(`${id}-${variantId}`)
            }
            let index = imgList.findIndex(l=> l.id === id)
            if(index !== -1) {
                let variantIndex = imgList[index].variants.findIndex(f=> f === variantId)
                array[index].variants.splice(variantIndex,1)
            }
        }
        else{
            if(formData.has(`${id}`)){
                formData.delete(`${id}`)
            }
            let index = imgList.findIndex(l=> l.id === id)
            if(index !== -1) {
                if(!array[index].variants.length){
                    array.splice(index,1)
                }
                else array[index].img = false
            }
        }
        setimgList(array)
    },[imgList,formData])

    useEffect(()=>{
        let isMounted = true
        if(successfulCreation && isMounted){
            send()
        }
        return () => isMounted = false
    },[send,successfulCreation])
    useEffect(()=>{
        if(pressed){
            let flData = filterData()
            getData(flData)
        }
    },[pressed,getData,filterData])
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
                {list.map((l,i)=>(
                <div key={l.id} style={{borderBottom:"1px solid black",margin:"2px"}}>
                   <div style={{display:"flex",justifyContent:"space-between"}}>
                       <span style={{wordBreak:"break-all"}}>№ {i+1} {l.title}</span>
                     <div style={{display: !l.title.length ? "none" : "flex", alignItems:"center"}}>
                           <label htmlFor={l.id + 1}><img style={{cursor:"pointer"}} src={imgList.find(ls=> ls.id === l.id)?.img ? uploadedImg : uploadImg} alt="upload"/></label>
                           <input style={{display:"none"}} onChange={(e)=>upload(e,l.id,null)} id={l.id +1} type='file' />
                           
                           {imgList.find(ls=> ls.id === l.id)?.img && <span onClick={()=> removeData(l.id,null)} style={{marginLeft:"12px",color:"red", cursor:"pointer"}}>X</span>}
                       </div>
                   </div> 
                   <ul>
                       {l.variants.map((v)=>(
                           <li key={v.id}>
                               <div style={{display:"flex",justifyContent:"space-between"}}>
                                    <span style={{wordBreak:"break-all", color: v.correct && "lime"}}>{v.title}</span>
                                     <div style={{display: !l.title.length ? "none" : "flex", alignItems:"center"}}>
                                        <label htmlFor={v.id - 1}><img style={{cursor:"pointer"}} src={imgList.find(ls=> ls.id === l.id)?.variants.includes(v.id) ? uploadedImg : uploadImg} alt="upload"/></label>
                                        <input style={{display:"none"}} onChange={(e)=>upload(e,l.id,v.id)} id={v.id -1} type='file' />

                                        {imgList.find(ls=> ls.id === l.id)?.variants.includes(v.id) && <span onClick={()=> removeData(l.id,v.id)} style={{marginLeft:"12px",color:"red", cursor:"pointer"}}>X</span>}
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