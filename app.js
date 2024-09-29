const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 
const dotenv = require('dotenv'); 


const app = express();
const port = 3000;

// My Middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Citizen Accountability Platform (C.A.P) API');
});

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);  

// Starting server
app.listen(port, () => {
    console.log(`Server running at https://localhost:${port}`);
});
