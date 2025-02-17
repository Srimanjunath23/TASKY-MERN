//using express
const express=require('express');

//using mongoose
const mongoose=require('mongoose')

// creating express app
const app=express();

//using cors

const cors=require('cors');

//middleware
app.use(express.json());

app.use(cors());


//creating schema
const taskyschema=mongoose.Schema({
    title:{
        required:true,
        type: String
    },
    description:String
});

//creating modal
const taskymodal=mongoose.model('Tasky',taskyschema);


//temp storage arr
// const todo=[];

//connecting DB
mongoose.connect('mongodb://localhost:27017/tasky-app')
.then(()=>{
    console.log("DB CONNECTED")
})
.catch((err)=>{
    console.log(err)
})


//route to add new item
app.post('/tasky',async (req,res)=>{
    const {title,description}=req.body;
    try {
        const newitem=new taskymodal({
            title,description
        })
        await newitem.save();
        res.status(200).json(newitem);
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
        
    }
    // const newitem={
    //     id:todo.length+1,
    //     title,description
    // }
    // todo.push(newitem)

    // console.log(todo);
    

})

//GET all data
app.get('/tasky',async (req,res)=>{
    try {
        const todo= await taskymodal.find();
    res.status(200).json(todo);
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
    
});

//update based on id
app.put('/tasky/:id',async (req,res)=>{
    try {
    const {title,description}=req.body;
    const id=req.params.id;
    const updatedata=await taskymodal.findByIdAndUpdate(

            id,
            {title,description},
            {new:true}
        
    );
    if(!updatedata){
        res.status(500).json({message:error.message});
    }
    else{
        res.status(200).json(updatedata)
    }

    }
        
     catch (error) {
        res.status(500).json({message:error.message});
    }
        
    
    
})
//Delete the server
app.delete('/tasky/:id',async (req,res)=>{
    
    try {
        const id=req.params.id
        await taskymodal.findByIdAndDelete(id);
        res.status(200).end
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})
//start the server

app.listen(8000,()=>{
    console.log("Server is running on port:8000");
})