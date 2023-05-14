const express=require("express")
const {connection}=require("./db")
const bodyparser=require("body-parser")
const{quizRouter}=require("./routes/quiz.routes")
const port=3000

const app=express()

app.use(bodyparser.json());

app.use("/quizzess",quizRouter)


app.listen(port,async()=>{
    try{
        await connection
        console.log("connected to Db")
    }catch (err){
        console.log("cannot connected to Db")
        console.log(err)
    }
    console.log(`server running at port ${port}`)
})
