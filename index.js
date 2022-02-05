const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
let db = null;

//The below query is joins the current directory to the database that i have created

const dbPath = path.join(__dirname, "movies.db");

// open() method is used to connect the database server and provides a connection object

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// Get All Movies
// I am ordering it according to release date if there will be no query parameters .

app.get("/movies/", async (request, response) => {
  const {
    order_by = "release_date",
    search_actor_name = "",
    order = "ASC",
  } = request.query;
  const getMovieQuery = `
    SELECT
      *
    FROM
     movies
    WHERE
     actor_name LIKE '%${search_actor_name}%'
    ORDER BY ${order_by} ${order}`;
  const movieArray = await db.all(getMovieQuery);
  response.send(movieArray);
});

//Post Movie API . With this you can add any number of movies in database
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const {
    movieName,
    actorName,
    actressName,
    directorName,
    releaseDate,
  } = movieDetails;
  const addMovieQuery = `INSERT INTO
      movies (movie_name,actor_name,actress_name,director_name,release_date)
    VALUES
      (
        '${movieName}',
        '${actorName}',
        '${actressName}',
        '${directorName}',
         ${releaseDate}
      );`;
  const dbResponse = await db.run(addMovieQuery);
  response.send("Your movie has been added");
});

// I have created two http request in movies.http do try them
