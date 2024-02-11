const express = require('express')

const moviesData = require('./Movie Data/data.json')


const app = express();




app.get('/', (req, res) => {

  let theMovies = []


  moviesData.data.forEach(e => {

      let singleMovie = new Movie(e.title, e.poster_path, e.overview);
      
      theMovies.push(singleMovie);
    
  });


  res.json(theMovies);
});


function Movie(title, poster_path, overview) {
    this.title = title,
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




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



