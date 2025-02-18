import React, { useEffect, useState } from 'react'

const Tasky = () => {
  const [title,settitle]=useState("");
  const [description,setdescription]=useState("");
  const [error,seterror]=useState("");
  const [successmsg,setsuccessmsg]=useState("");
  const [entireTask,setentireTask]=useState([])
  const api="http://localhost:8000"
  const addItem=()=>{
    if(title.trim()!=="" && description.trim()!==""){
      fetch(api+'/tasky',{
        method:"POST",
        headers:{
          'Content-type':'application/json'
        }
        ,body:JSON.stringify({title,description})
      }).then(
        (res)=>{
          if(res.ok){
            setentireTask([...entireTask,{title,description}]);
            setsuccessmsg("Item added successfuly :)")
            setTimeout(()=>
            setsuccessmsg(""),3000)

          }
          else{
            seterror("Unable to add Item :(");
            setTimeout(()=>
              seterror(""),3000)

          }
        }
      )
    }
   

  }
  useEffect(()=>{
    displayItems();

  },[])

  function displayItems(){
    fetch(api+'/tasky').then((res)=>res.json()).then((res)=>setentireTask(res))
  
  }


  return (
    
<>
<div className='row p-3 bg-primary text-white text-center'>
  <h1>TaskyTrack</h1>
</div>
<br/>
<div className='row '>
  <h3>Add Item </h3>
  
<div className='input-group d-flex gap-2 '>
    <input placeholder='Add Title' className='form-control rounded w-25 col-12 col-sm-6' type='text' onChange={(e)=>settitle(e.target.value)}/>
    <input placeholder='Add Description' className='form-control rounded w-25 col-12 col-sm-6' type='text' onChange={(e)=>setdescription(e.target.value)}/>
    <button className='btn btn-warning rounded col-12 col-sm-auto ' onClick={addItem}>Add Item</button>
</div>
 {successmsg && <p className='text-success'>{successmsg}</p>} 
 {error && <p className='text-danger'>{error}</p>} 
</div>
<br/>

<div className='row p-4' >
  {
    entireTask.map((item)=>
      <div className="card me-3  d-flex gap-2" style={{width:'18rem'}}>
     <div className="card-body">
    <h5 className="card-title">{item.title}</h5>
    <p className="card-text">{item.description}</p>
    <button className='btn btn-warning me-2'>Edit</button><button className='btn btn-danger'>Delete</button>
  </div>
</div>
    )
  }


</div>
</>
    

  
  )
}

export default Tasky