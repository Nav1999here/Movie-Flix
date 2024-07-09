// src/components/MovieCard.js
import React from "react";
import "../App.css";

const MovieCard = ({ movie, genresName }) => {
  //let names = movie.genre_ids?.map((el) => genresName[el]);
  //console.log(names);
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p>{movie.overview}</p>
        <p>
          <strong>Genre:</strong>
        </p>
        <p>
          <strong>Popularity:</strong> {movie.popularity}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
