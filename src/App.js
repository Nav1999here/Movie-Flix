// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieList from "./components/MovieList";
import GeneralFilter from "./components/GeneralFilter";
import SearchBar from "./components/SearchBar";
import "./App.css";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [year, setYear] = useState(2012);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genresName, setGenresName] = useState({});

  useEffect(() => {
    fetchGenres();
    fetchMovies(year, searchTerm);
  }, [year, selectedGenres, searchTerm]);

  const fetchGenres = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list`,
      {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
        },
      }
    );

    response.data.genres.forEach((el) => {
      setGenresName((prev) => ({
        ...prev,
        [el.id]: el.name,
      }));
    });

    setGenres(response.data.genres);
  };

  const fetchMovies = async (year, searchTerm = "") => {
    setLoading(true);
    const genreQuery = selectedGenres.length
      ? `&with_genres=${selectedGenres.join(",")}`
      : "";
    const searchQuery = searchTerm ? `&query=${searchTerm}` : "";
    console.log(genreQuery, selectedGenres);
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie`,
      {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
          sort_by: "popularity.desc",
          primary_release_year: year,
          page: 1,
          Vote_count_gte: 100,
          with_genres: selectedGenres.length ? selectedGenres.join(",") : "",
          //query: searchTerm,
        },
      }
    );
    setMovies(response.data.results);
    setLoading(false);
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0) {
      setYear((prevYear) => prevYear - 1);
    } else if (
      e.target.scrollHeight - e.target.scrollTop ===
      e.target.clientHeight
    ) {
      setYear((prevYear) => prevYear + 1);
    }
  };

  const handleGenreChange = (genreIds) => {
    setSelectedGenres(genreIds);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="App" onScroll={handleScroll}>
      <h1>Movie Information</h1>
      <SearchBar onSearch={handleSearch} />
      <GeneralFilter genres={genres} onChange={handleGenreChange} />
      {loading && <p>Loading...</p>}
      <MovieList movies={movies} genresName={genresName} />
    </div>
  );
};

export default App;
