

const express = require('express')

const axios = require('axios');

const { Client } = require('pg')

const app = express();

const moviesData = require('./Movie Data/data.json')

require('dotenv').config()

const port = process.env.PORT;

const apiKey = process.env.API_KEY;

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


//const connectionURL = 'postgres://abdullah:1808@localhost:5432/movies'

const connectionURL = `postgres://cyovjetk:${process.env.elephantsql}-@stampy.db.elephantsql.com/cyovjetk`

const client = new Client(connectionURL);



///UPDATE/id

app.put('/UPDATE/:id', (req, res) => {

  let MovieID = req.params.id;

  let { title, release_date, poster_path, overview, comments } = req.body;

  let sql = `UPDATE movie
  SET title = $2, release_date = $3, poster_path = $4, overview = $5, comments = $6
  WHERE id = $1;`;

  let values = [MovieID, title, release_date, poster_path, overview, comments];

  client.query(sql, values).then(

    (result) => {
      res.send("Updated")
    })

    .catch(error => {

      console.error('Error', error);

      res.status(500).json({ error: 'Internal Server Error' });

    });
}
)



///delete/id

app.delete('/DELETE/:id', (req, res) => {

  let MovieID = req.params.id;

  let sql = ` DELETE FROM movie WHERE id = $1;`;

  let values = [MovieID];

  client.query(sql, values).then(

    (result) => {
      res.send("Deleted")
    })

    .catch(error => {

      console.error('Error', error);

      res.status(500).json({ error: 'Internal Server Error' });

    });
}
)


//getMovie/id


app.get('/getMovie/:id', (req, res) => {

  let MovieID = req.params.id;

  const sql = `SELECT * FROM movie WHERE id = $1;`

  let values = [MovieID];

  client.query(sql, values).then(

    (result) => {

      res.status(201).json(result.rows)
    })

    .catch(error => {

      console.error('Error', error);

      res.status(500).json({ error: 'Internal Server Error' });

    });
}
)




//add Movies

app.post('/addMovie', (req, res) => {

  console.log(req.body)

  const { title, release_date, poster_path, overview, comments } = req.body

  const sql = `INSERT INTO movie (title, release_date, poster_path, overview, comments) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  const values = [title, release_date, poster_path, overview, comments];


  client.query(sql, values).then(

    (result) => {
      console.log(result.rows)
      res.status(201).json(result.rows)
    })

    .catch(error => {

      console.error('Error', error);

      res.status(500).json({ error: 'Internal Server Error' });

    });
}
)


//get Movies

app.get('/getMovies', (req, res) => {

  const sql = `SELECT * FROM movie;`
  client.query(sql).then(

    (result) => {

      res.status(201).json(result.rows)
    })

    .catch(error => {

      console.error('Error', error);

      res.status(500).json({ error: 'Internal Server Error' });

    });
}
)



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

  res.send("WELCOM TO THE MOVIES APP")

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



client.connect().then(() => {

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}).catch()

