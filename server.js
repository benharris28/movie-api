require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies.json')

console.log(process.env.API_TOKEN)
const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    console.log('validate bearer token middleware')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized Request'})
    }
    next()
})

function handleGetMovie(req, res) {
    let response = MOVIES;

    const { genre, country, avg_vote } = req.query;
    
    if(genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }

    if(country) {
        response = response.filter(movie => 
           movie.country.toLowerCase().includes(country.toLowerCase())
           )
    }

    if(avg_vote) {
        response = response.filter(movie => 
          Number(movie.avg_vote) >= Number(req.query.avg_vote) )
    }

    res.json(response)


}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
    console.log('Server listening at Port 8000')
})