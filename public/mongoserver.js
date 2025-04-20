var express=require('express')
var app=new express()
const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost:27017/user")
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const userSchema=new mongoose.Schema({
    username:String,
    password:String
})
var User=mongoose.model("User",userSchema)
app.get('/',function(req,res){
    res.redirect('/login')
})
app.get('/register',function(req,res){
    res.sendFile(__dirname+'/registerform.html')
})
app.get('/login',function(req,res){
    res.sendFile(__dirname+'/loginform.html')
})
app.get('/dashboard',function(req,res){
    res.sendFile(__dirname+'/dashboard.html')
})
app.post('/register',async(req,res)=>{
    const data=new User(req.body)
    const result=await data.save()
    res.send(`User registered successfully <a href="/login">Login</a>`)
})
app.post('/login',async(req,res)=>{
    const user=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })
    if(user){
        res.redirect('/dashboard')
    }
    else{
        res.send(`Enter correct details <a href='/login'>login<\a>`)
    }

})
app.listen(3000)