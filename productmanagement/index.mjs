import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import config from './config.mjs';
import router from './src/route.mjs';
const app= express();
app.use(express.json());
app.use(multer().any());
mongoose.connect(config.mongoURI).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});
app.use('/',router);
app.listen(config.port,()=>{
    console.log(`Server is running on port ${config.port}`);
})