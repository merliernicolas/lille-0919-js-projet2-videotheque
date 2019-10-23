import React from "react";
import TopBar from "./components/TopBar";
import ActorsList from "./components/ActorsList";
import MainPage from "./components/MainPage";
import Footer from "./components/Footer";
import MoviePageFilterByTitle from "./components/MoviePageFilterByTitle";
import "./App.css";

function App() {
  return (
    <div className="App">
      <TopBar />
      <MainPage />
      <MoviePageFilterByTitle />
      <ActorsList />
      <Footer />
    </div>
  );
}

export default App;
