const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const http = require('http');
const PORT = process.env.PORT || 3000;

const userRoutes = require('./api/route/user');

// IgGTjZvjV5fJTfjf
mongoose.connect('mongodb+srv://admin1:IgGTjZvjV5fJTfjf@cluster0.nrc6un4.mongodb.net/node-auth?retryWrites=true&w=majority');


mongoose.connection.on('error', err=>{
    console.log('connection failed');
})

mongoose.connection.on('connected', connected=>{
    console.log('connected to database');
});



app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/user', userRoutes);

app.use((req, res, next) => {
   res.status(404).json({
    error : 'Not found'
   })
})


const server = http.createServer(app);

server.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});

