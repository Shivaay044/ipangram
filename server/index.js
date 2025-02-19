const express = require("express");
const { connection } = require("./config/db");
const app = express();
require("dotenv").config();
const cors  = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const { errorHandler } = require("./utils/error");




app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));


app.use("/api", router);

app.use(errorHandler)




app.listen(process.env.PORT,async()=>{
    try {
       await connection
       console.log("connected to db");
       console.log(`server is running at http://localhost:${process.env.PORT}`)
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
})
















