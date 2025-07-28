const express=require('express');
const app=express();
const multer = require("multer");
const path = require("path");
const cors=require('cors')
const fs = require('fs');


const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads"));

const db= require("./models")

const artRouter=require('./Routes/Articles')
app.use('/article',artRouter)
const uploadRouter = require("./Routes/Uploads");
app.use("/upload", uploadRouter);



const debugRouter = require('./Routes/Debug');
app.use('/debug', debugRouter);

const officersRouter = require('./Routes/Officers');
app.use('/officers', officersRouter);


db.sequelize.sync({ force: true }).then(()=>{
    app.listen(3001,() => {
            console.log("Server running on port 3001");
        });
    });

    