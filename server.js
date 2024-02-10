// Import required packages
const express = require('express');
const cors = require('cors');

// Create an instance of Express
const app = express();

// Middleware
app.use(cors());

// Define routes
// Home Page Endpoint
app.get('/', (req, res) => {
    // Use a constructor function to ensure data format
    // Replace the sampleData with your actual data
    const moviesData = constructMovieData(movie);
    res.json(moviesData);
});



// Favorite Page Endpoint
app.get('/favorite', (req, res) => {
    res.send('Welcome to Favorite Page');
  });
  
  // Error Handling - Server Error
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 500, responseText: 'Sorry, something went wrong' });
  });
  
  // Error Handling - Page Not Found
  app.use((req, res) => {
    res.status(404).json({ status: 404, responseText: 'Page not found' });
  });




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});








// Constructor function to ensure data format
function constructMovieData(data) {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format. Expecting an array of movie objects.');
  }

  // Ensure each movie object has required properties
  const formattedData = data.map(movie => {
    if (!movie.title || !movie.poster_path || !movie.overview) {
      // If any required property is missing, provide default values or handle it accordingly
      return {
        title: movie.title || 'Unknown Title',
        poster_path: movie.poster_path || '/default-poster.jpg',
        overview: movie.overview || 'No overview available.'
      };
    }

    // If all required properties are present, return the original movie object
    return movie;
  });

  return formattedData;
}

// Sample data for testing
const movie = [
    // Your movie objects here
    {
        title: "Spider-Man: No Way Home",
        poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man."
    },
    {
        poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    },


];
