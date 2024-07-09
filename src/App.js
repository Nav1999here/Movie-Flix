// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MovieList from "./components/MovieList";
import GeneralFilter from "./components/GeneralFilter";
import SearchBar from "./components/SearchBar";
import "./App.css";
import Loader from "./components/Loader";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [year, setYear] = useState(2012);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genresName, setGenresName] = useState({});
  const [loadedYears, setLoadedYears] = useState([2012]);

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
    setMovies((prevMovies) => ({
      ...prevMovies,
      [year]: response.data.results,
    }));

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
  const handleObserver = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const year = parseInt(entry.target.dataset.year, 10);
          if (entry.target.dataset.direction === "up") {
            const newYear = year - 1;
            if (newYear >= 2012 && !loadedYears.includes(newYear)) {
              setLoadedYears((prevYears) => [...prevYears, newYear]);
              fetchMovies(newYear, selectedGenres.join(","), searchTerm);
            }
          } else {
            const newYear = year + 1;
            if (newYear <= 2023 && !loadedYears.includes(newYear)) {
              setLoadedYears((prevYears) => [...prevYears, newYear]);
              fetchMovies(newYear, selectedGenres.join(","), searchTerm);
            }
          }
        }
      });
    },
    [fetchMovies, loadedYears, selectedGenres, searchTerm]
  );
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });
    const upSentinel = document.querySelector("#up-sentinel");
    const downSentinel = document.querySelector("#down-sentinel");

    if (upSentinel) observer.observe(upSentinel);
    if (downSentinel) observer.observe(downSentinel);

    return () => {
      if (upSentinel) observer.unobserve(upSentinel);
      if (downSentinel) observer.unobserve(downSentinel);
    };
  }, [handleObserver]);

  return (
    <div className="App">
      <h1>Movie Information</h1>

      <SearchBar onSearch={handleSearch} />
      <GeneralFilter genres={genres} onChange={handleGenreChange} />
      {loading && <Loader />}
      <div
        id="up-sentinel"
        data-year={Math.min(...loadedYears)}
        data-direction="up"
      ></div>
      {loadedYears
        .sort((a, b) => a - b)
        .map((year) => (
          <React.Fragment key={year}>
            <h2>{year}</h2>
            <MovieList movies={movies[year] || []} />
          </React.Fragment>
        ))}
      <div
        id="down-sentinel"
        data-year={Math.max(...loadedYears)}
        data-direction="down"
      ></div>
    </div>
  );
};

export default App;
