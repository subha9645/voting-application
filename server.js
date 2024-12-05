const express = require('express')
const app = express();
require('dotenv').config();
const bodyParser=require('body-parser');
app.use(bodyParser.json());
const db=require('./db');
const userRoutes=require('./Routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user',userRoutes);
app.use('/candidate', candidateRoutes);

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log('listening')
})