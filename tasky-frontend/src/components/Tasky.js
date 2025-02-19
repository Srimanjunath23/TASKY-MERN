import React, { useEffect, useState } from 'react'
import {Toaster} from '@blueprintjs/core'

const toast=Toaster.create({
  position:"top-right"
})

const Tasky = () => {
  const [title,settitle]=useState("");
  const [description,setdescription]=useState("");
  const [error,seterror]=useState("");
  // const [successmsg,setsuccessmsg]=useState("");
  const [entireTask,setentireTask]=useState([]);
  const [editid,seteditid]=useState(-1);
  const [edittitle,setedittitle]=useState("")
  const [editdescription,seteditdescription]=useState("")
  
  const api="http://localhost:8000"
  const addItem=()=>{
    if(!title.trim() || !description.trim()){
      seterror("Title and Description cannot be empty.");
      setTimeout(()=>seterror(""),3000)
    }
    else if(title.trim()!=="" && description.trim()!==""){
      fetch(api+'/tasky',{
        method:"POST",
        headers:{
          'Content-type':'application/json'
        }
        ,body:JSON.stringify({title,description})
      }).then(async (res)=>{
        const newdata= await res.json();
        if(res.ok){
          setentireTask((entireTask)=>[...entireTask,newdata ]);
          settitle("")
          setdescription("")
          toast.show({
            message:"Item  added successfully",
            intent:"success",
            timeout:"3000"
          });

          //setsuccessmsg("Item added successfuly :)")
          //setTimeout(()=>
          //setsuccessmsg(""),3000)
         

        }
       
        else{
          seterror("Cant able to add item");
          setTimeout(()=>
            seterror(""),3000)

        }
      })
     
    }
   

  }
  useEffect(()=>{
    displayItems();

  },[])

  function displayItems(){
    fetch(api+'/tasky').then((res)=>res.json()).then((res)=>setentireTask(res))
  
  }

  function reqeditdata(item){
    seteditid(item._id)
    setedittitle(item.title)
    seteditdescription(item.description)
  }
  function updateItem(){
    if(edittitle.trim()!=="" && editdescription.trim()!==""){
      fetch(api+'/tasky/'+editid,{
        method:"PUT",
        headers:{
          'Content-type':'application/json'
        }
        ,body:JSON.stringify({title:edittitle,description:editdescription})
      }).then(
        (res)=>{
          if(res.ok){
            entireTask.map((item)=>{
              if(item._id===editid){
                item.title=edittitle
                item.description=editdescription
              }
              return item
            })
            // setsuccessmsg("Item updated successfuly :)")
            // setTimeout(()=>
            // setsuccessmsg(""),3000)

            toast.show({
              message:"Item  Updated successfully",
              intent:"success",
              timeout:"3000"
            });
            seteditid(-1)
           

          }
          else{
            seterror("Unable to update Item :(");
            setTimeout(()=>
              seterror(""),3000)

          }
        }
      )
    }

  }
  const deleteItem=(id)=> {
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(api + '/tasky/' + id, { method: 'DELETE' })
        .then((res) => {
          if (res.ok) {
            // Update the state immediately after successful deletion
            setentireTask((prevTasks) => prevTasks.filter((item) => item._id !== id));
            // setsuccessmsg("Item deleted successfully :)");
            // setTimeout(() => setsuccessmsg(""), 3000);
            toast.show({
              message:"Item  Deleted successfully",
              intent:"success",
              timeout:"3000"
            });
          } else {
            seterror("Unable to delete item :(");
            setTimeout(() => seterror(""), 3000);
          }
        })
        .catch(() => {
          seterror("Something went wrong!");
          setTimeout(() => seterror(""), 3000);
        });
    }
  }
  
  return (
    
<>
{/* HEADING */}
<div className=' row p-2 bg-light text-dark text-center  '>
  
  <h1  style={{fontFamily:'serif',fontWeight:'bolder'}} >TaskyTrack</h1>
    <p className="text-muted-foreground  mt-2">Keep track of your daily tasks</p>
</div>
<br/>

{/* ADD ITEM */}
<div className='shadow-lg  bg-warning text-dark row border p-2 rounded m-1'>
  <h3>Add Item </h3>
  
<div className='input-group d-flex gap-2 mb-4'>
    <input placeholder='Add Title' className='form-control rounded w-25 col-12 col-sm-6' type='text' value={title} onChange={(e)=>settitle(e.target.value)} required/>
    <input placeholder='Add Description' className='form-control rounded w-25 col-12 col-sm-6' type='text' value={description} onChange={(e)=>setdescription(e.target.value)} />
    <button className='btn btn-dark text-white rounded col-12 col-sm-auto ' onClick={addItem}>Add Item</button>
</div>
{error&& <h5 className='text-danger'>{error}</h5>}

</div>
<br/>

{/* CARD */}
<div className='row p-4'>
<h1>TASKS</h1>

{successmsg && <p className='text-success'>{successmsg}</p>} 
{/* {error && <p className='text-danger'>{error}</p> } */}

<br/>
  {
    entireTask.map((item)=>
    <div className="col-sm-6 mb-3" >
    <div className="card h-100"  style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }} >
      <div className="card-body d-flex flex-column justify-content-between rounded text-white" style={{ backgroundColor: "rgba(12, 14, 15, 0.8)" }} >
       
          {
          editid === -1 || editid !== item._id ? <>
            <h5 className="card-title">{item.title}</h5>
            <p className="card-text">{item.description}</p></>:
            <>
            <div className='input-group d-flex gap-2 '>
                <input placeholder='Add Title' className='form-control rounded w-25 col-12 col-sm-6' type='text'  onChange={(e)=>setedittitle(e.target.value)} value={edittitle}/>
               <input placeholder='Add Description' className='form-control rounded w-25 col-12 col-sm-6' type='text'  onChange={(e)=>seteditdescription(e.target.value)} value={editdescription}/>
            </div>
            </>
            }
         
       
        <div className="mt-auto pt-2">
          {
            editid === -1 || editid !==item._id ?
            <>
             <button className="btn btn-warning me-2" onClick={()=> {reqeditdata(item)}}>EDIT</button>
             <button className="btn btn-danger" onClick={()=>deleteItem(item._id) }>Delete </button>
            </>
            :
            <>
            <button className="btn btn-warning me-2" onClick={()=>updateItem()}>Update</button>
            <button className="btn btn-danger" onClick={()=> seteditid(-1)}> Cancel</button>
            
            </>
          }
          
         
        </div>
      </div>
    </div>
  </div>

    )
  }


</div>
</>
    

  
  )
}

export default Tasky