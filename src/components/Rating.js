import React, { useState,useCallback,useEffect } from "react"
import hollow_star from "../assets/hollow_star_24.png"
import star from '../assets/star_24.png'
import half_star from  "../assets/half_star_24.png"
import funcWrapper from '../utils/funcWrapper'
import { useAuth } from "../hooks/useAuth"
const Rating = ({style,testId,setErrorMessage}) => {
  const {isAuth} = useAuth()
  const [stars, setStars] = useState([
    { id: 0, selected: false },
    { id: 1, selected: false },
    { id: 2, selected: false },
    { id: 3, selected: false },
    { id: 4, selected: false },
  ])
  const [selectedIndex,setSelectedIndex] = useState(-1)
  const [globalRating,setGlobalRating] = useState(-1)
  const [averageRating,setAverageRating] = useState(0)
  const [update,setUpdate] = useState(0)
  const [numberOfRated,setNumberOfRated] = useState(0)
  const [hoverElement,setHoverElement] = useState(false)
  const [isFloat,setIsFloat] = useState(false)

  useEffect(()=>{
    fetch(`/api/test/rating?id=${testId}`,{method:"GET"})
    .then(async res=>{
        let {rating,numberOfUsers} = await res.json()
        setAverageRating(rating)
        if(res.ok){
          setNumberOfRated(numberOfUsers)
        }
        if(rating % 1 !== 0){
          let roundRating = Math.trunc(rating)
          setIsFloat(true)
          setGlobalRating(roundRating)
        }
        else setGlobalRating(rating -1)
    })
  },[testId,update])

  useEffect(()=>{
    if(globalRating !== -1){
    let arr = [...stars]
    arr.map((s)=>{
        if(globalRating !== -1){
            if(s.id <= globalRating){
                s.selected = true
            }
            else s.selected = false
        }
        else s.selected = false
        return s
    })
    setStars(arr)
    }
  },[globalRating])
  
  const send = useCallback((id)=>{
    fetch('/api/test/add/rating',{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rating:id+1,testId})})
    .then(res=>{
      if(!res.ok){
        setErrorMessage(res.message)
      }
      else setUpdate(Math.random())
    })
  },[setErrorMessage,testId])
  const overElement = useCallback((id) =>{
      const arr = [...stars]
    
      arr.map((s)=>{
          if(s.id <= id){
              s.selected = true
          }
          else s.selected = false
          return s
      })
      setHoverElement(true)
      setStars(arr)
  },[stars])
  const leaveElement = useCallback((id) =>{
    const arr = [...stars]

    arr.map((s)=>{
        if(s.id >= id){
            s.selected = false
        }
        
        return s
    })
    setStars(arr)
  },[stars])

  const selectElement = useCallback((id) =>{
    if(isAuth){
    const arr = [...stars]
    arr.map((s)=>{
        if(s.id <= id){
            s.selected = true
        }
        return s
    })
    setSelectedIndex(id)
    setGlobalRating(-1)
    setStars(arr)
    send(id)
  }
  },[stars,send,isAuth])
  const returnStars = useCallback(()=>{
    let arr = [...stars]
    arr.map((s)=>{
        if(selectedIndex !== -1 && globalRating <= 0){
            if(s.id <= selectedIndex){
                s.selected = true
            }
            else s.selected = false
        }
        else if(globalRating >= 0){
          if(s.id <= globalRating){
            s.selected = true
        }
          else s.selected = false
        } 
        else s.selected = false
        
        return s
    })
    setStars(arr)
    setHoverElement(false)
  },[selectedIndex,stars,globalRating])
  return (
    <>
    <div onMouseLeave={funcWrapper(returnStars)} style={{...style,userSelect: 'none', display: "flex", flexDirection: "row",cursor:"pointer",justifyContent: "center"}}>
      {stars.map((s) => (
        <div key={s.id} data-id={s.id} onMouseOver={funcWrapper(overElement,s.id)} onMouseLeave={funcWrapper(leaveElement,s.id)} onClick={funcWrapper(selectElement,s.id)}>
          {s.selected ? 
          <img alt="star" src={s.id === globalRating && isFloat && !hoverElement ? half_star : star} /> : 
          <img alt="star" src={hollow_star} />}
        </div>
      ))}
    </div>
      <div style={{display: 'flex',justifyContent:"center"}}>
        <div style={{fontSize: '24px',color:"gold",marginRight:"4px"}}>{averageRating}</div>
        <div style={{display: 'flex',flexDirection:"column",justifyContent:"end"}}>({numberOfRated})</div>
      </div>
    </>
  )
}

export default React.memo(Rating)
