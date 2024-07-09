// src/components/GenreFilter.js
import React, { useState } from "react";
import "../App.css";

const GenreFilter = ({ genres, onChange }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenreClick = (id) => {
    const newSelectedGenres = selectedGenres.includes(id)
      ? selectedGenres.filter((genreId) => genreId !== id)
      : [...selectedGenres, id];

    setSelectedGenres(newSelectedGenres);
    onChange(newSelectedGenres);
  };

  return (
    <div className="genre-filter">
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`genre-button ${
            selectedGenres.includes(genre.id) ? "selected" : ""
          }`}
          onClick={() => handleGenreClick(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
