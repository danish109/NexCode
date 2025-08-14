const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth");
const redisclient = require("./config/redis");
const problemRouter = require("./routes/problemCreator");
const submitRouter=require("./routes/Submit")
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator");
const cors=require('cors')

app.use(cors({
  origin:'http://localhost:5173',//use * for evryhost access
  credentials:true
}))



app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai",aiRouter);
app.use("/video",videoRouter);

const InitalizeConnection = async () => {
  try {
    await Promise.all([main(), redisclient.connect()]);
    console.log("DB Connected");
    app.listen(process.env.PORT, () => {
      console.log("Server Running at Port :" + process.env.PORT);
    });
  } catch (err) {
    console.log("ERROR OCCURED:" + err.message);
  }
};
InitalizeConnection();

// main()
// .then(async ()=>{
//     app.listen(process.env.PORT,()=>{
//     console.log("Server runnning at Port :"+process.env.PORT)
// })
// })
// .catch(err=>console.log("ERRROR OCCURED:"+err))
