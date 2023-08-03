const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; // port number

const max_jokes = 25; // maximo de 25 chistes
const jokeIDs = new Set();

const fetchJoke = async () => {
    const { data } = await axios.get('https://api.chucknorris.io/jokes/random');
    return data;
};

//endpoint
app.get('/jokes', async (req, res) => {
    try {
        let jokes = [];
        while (jokes.length < max_jokes) {
            const jokePromises = Array(max_jokes - jokes.length)
                .fill()
                .map(fetchJoke);
            const newJokes = await Promise.all(jokePromises);
            newJokes.forEach((joke) => {
                if (!jokeIDs.has(joke.id)) {
                    jokeIDs.add(joke.id);
                    jokes.push(joke);
                }
            });
        }
        res.json(jokes); // respuesta con el arreglo de chistes en json
    } catch (error) {
        console.error('Error en la obtencion de chistes: ', error);
        res.status(500).json({ error: 'Error Interno del servidor' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/jokes`);
});
