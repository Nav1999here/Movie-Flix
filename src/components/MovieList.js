// src/components/MovieList.js
import React from "react";
import MovieCard from "./MovieCard";
import "../App.css";

const MovieList = ({ movies, genresName }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} genresName={genresName} />
      ))}
    </div>
  );
};

export default MovieList;
