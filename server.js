const express = require('express')

const axios = require('axios');

const moviesData = require('./Movie Data/data.json')

require('dotenv').config()


const app = express();

const apiKey = process.env.API_KEY;


//trending
app.get('/trending', (req, res) => {

  axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)

    .then(response => {

      let trendingMovies = response.data.results.map(movieData => {

        return new Movie(movieData.id, movieData.title, movieData.release_date, movieData.poster_path, movieData.overview)

      });

      res.json(trendingMovies);

    })

    .catch(error => {

      console.error('Error fetching trending movies:', error);

      res.status(500).json({ error: 'Internal Server Error' });

    });

});


//search

app.get('/search', (req, res) => {

  let movieName = req.query.name;

  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=2&query=${movieName}`)

    .then(searchResult => {

      res.json(searchResult.data.results);

    })
    .catch(error => {

      console.error('Error searching:', error);

      res.status(500).json({ error: 'Internal Server Error' });

    });

});


//searching by ID

app.get('/movie', (req, res) => {

  let movieID = req.query.id;

  axios.get(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`)

    .then(movieID => {

      res.json(movieID.data);

    })
    .catch(error => {

      console.error('Error fetching movie details:', error);

      res.status(500).json({ error: 'Internal Server Error' });

    });

});


///tv Popular

app.get('/tv/popular', (req, res) => {


  axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`)

    .then(tvPopular => {

      res.json(tvPopular.data);

    })
    .catch(error => {

      console.error('Error fetching movie details:', error);

      res.status(500).json({ error: 'Internal Server Error' });

    });

});






app.get('/', (req, res) => {

  let theMovies = []


  moviesData.data.forEach(e => {

    let singleMovie = new Movie(e.title, e.poster_path, e.overview);

    theMovies.push(singleMovie);

  });


  res.json(theMovies);
});


function Movie(id, title, release_date, poster_path, overview) {
  this.id = id,
    this.title = title,
    this.release_date = release_date,
    this.poster_path = poster_path,
    this.overview = overview
}


app.get('/favorite', (req, res) => {
  res.send('Welcome to Favorite Page');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 500, responseText: 'Sorry, something went wrong' });
});


app.use((req, res) => {
  res.status(404).json({ status: 404, responseText: 'Page not found' });
});




const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



