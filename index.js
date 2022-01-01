import express, { application } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import dotenv from 'dotenv'

import postRoutes from './routes/posts.js' 
import userRoutes from './routes/users.js' 

const app  = express();
dotenv.config();
//FOR POST
app.use(bodyParser.json({limit: '30mb', extended: true}));//json to be used
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));//shallow parsing or deep parsing
app.use(cors());

//ROUTES
app.use('/posts', postRoutes);
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.send('Hello to memories API');
});

// const CONNECTION_URL = ''
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {
        useNewUrlParser: true,//just to avoid warning
        useUnifiedTopology: true 
    })
    .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
    .catch((error) => console.log(error.message));

//just to avoid warning //although adding it gives error
// mongoose.set('useFindAndModify', false);
