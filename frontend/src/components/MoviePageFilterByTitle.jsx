import React from "react";
import Axios from "axios";
import "./style/MoviePage.css";
import "./style/MoviePageModalTrailer.css";
import Modal from "react-modal";
import ActorsList from "./ActorsList";

class MoviePageFilterByTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieInfo: {
        title: "",
        overview: "",
        poster_path: "",
        release_date: "",
        genres: []
      },
      castInfo: {
        cast: [],
        crew: []
      },
      videoInfo: {
        results: [""]
      },
      modalIsOpen: false,
      img: "/pictures/play.png",
      pictoPlus: "/pictures/plusIcon.png",
      likeIcon: "/pictures/likeIcon.png",
      dislikeIcon: "/pictures/dislikeIcon.png"
    };
  }

  toggleModal = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  };

  componentDidMount = () => {
    const id = this.props.match.params.id;
    Axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=495d98b77df65d47fbf7eba028518ed7`
    ).then(({ data }) => {
      this.setState({ movieInfo: data });
    });
    Axios.get(
      `http://api.themoviedb.org/3/movie/${id}/credits?api_key=495d98b77df65d47fbf7eba028518ed7`
    ).then(({ data }) => {
      this.setState({ castInfo: data });
    });
    Axios.get(
      `http://api.themoviedb.org/3/movie/${id}/videos?api_key=495d98b77df65d47fbf7eba028518ed7`
    ).then(({ data }) => {
      this.setState({ videoInfo: data });
    });
  };

  addIconsFunction = iconId => {
    const { isLoggedIn, user } = this.props;

    if (isLoggedIn) {
      let iconType = "";
      let oldArray = [];
      switch (iconId) {
        case "toWatch":
          iconType = "toWatchMovies";
          oldArray = user.toWatchMovies;

          break;
        case "favorite":
          iconType = "favoriteMovies";
          oldArray = user.favoriteMovies;
          break;
        case "dislike":
          iconType = "dislikeMovies";
          oldArray = user.dislikeMovies;
          break;
        default:
          break;
      }

      const movieId = this.props.match.params.id;

      if (oldArray.includes(movieId)) {
        this.props.notification("warning", "Movie already in the list!");
        return;
      }

      const newArray = [...oldArray, movieId];

      Axios({
        method: "patch",
        url: `http://localhost:5000/users/${user.id}`,
        headers: { "content-type": "application/json; charset=utf-8" },
        data: {
          [iconType]: newArray
        }
      }).then(receipt => {
        this.props.notification("success", "Movie added in the list");
        this.props.updateUser(receipt.data);
      });
    } else {
      this.props.notification("warning", "Please, log in or sign up!");
    }
  };

  render() {
    const movieInfo = this.state.movieInfo;
    const videoInfo = this.state.videoInfo;

    return (
      <div id="around">
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          className="modalStyle"
          contentLabel="Trailer Modal"
          onRequestClose={this.toggleModal}
        >
          <iframe
            title="Trailer"
            src={`https://www.youtube-nocookie.com/embed/${videoInfo.results
              .filter((video, i) => {
                return i === 1;
              })
              .map((video, i) => {
                return video.key;
              })}`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen="1"
          ></iframe>
          <button className="closeTrailer" onClick={this.toggleModal}>
            close
          </button>
        </Modal>
        <div id="movieTrailerContainer" onClick={this.toggleModal}>
          <img
            src={`https://image.tmdb.org/t/p/original/${movieInfo.backdrop_path}`}
            className="trailerThumb"
            alt={movieInfo.title}
          />
          <div>
            <img
              alt={this.state.img}
              className="playIconOver"
              src={this.state.img}
              onMouseEnter={() => {
                this.setState({
                  img: "/pictures/playHover.png"
                });
              }}
              onMouseOut={() => {
                this.setState({
                  img: "/pictures/play.png"
                });
              }}
            />
          </div>
        </div>
        <div id="movieTitleContainer">
          <div id="movieMainJacket">
            <img
              id="movieMainJacketImg"
              src={`https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`}
              alt={this.props.title}
            ></img>
          </div>
          <div id="movieDescAndIcons">
            <div id="movieDescription">
              <h2>{movieInfo.title}</h2>
              <p>
                <span className="oneRedWord">By </span>
                {this.state.castInfo.crew
                  .filter((person, i) => {
                    return i === 1;
                  })
                  .map((person, i) => {
                    return person.name;
                  })}
              </p>
              <p>
                <span className="oneRedWord">Genre </span>
                {movieInfo.genres.map(genre => {
                  return genre.name + " ";
                })}
              </p>
              <p>
                <span className="oneRedWord">Released at </span>
                {movieInfo.release_date}
              </p>
              <p>
                <span className="oneRedWord">Runtime </span>
                {movieInfo.runtime} minutes
              </p>
            </div>

            {this.props.isLoggedIn && (
              <div className="movieIconsContainer">
                <img
                  id="moviePlusIcons"
                  alt={this.state.pictoPlus}
                  onClick={() => this.addIconsFunction("toWatch")}
                  src={this.state.pictoPlus}
                  onMouseEnter={() => {
                    this.setState({
                      pictoPlus: "/pictures/plusIconHover.png"
                    });
                  }}
                  onMouseOut={() => {
                    this.setState({
                      pictoPlus: "/pictures/plusIcon.png"
                    });
                  }}
                />
                <img
                  id="movieLikeIcons"
                  src={this.state.likeIcon}
                  alt={this.state.likeIcon}
                  onClick={() => this.addIconsFunction("favorite")}
                  onMouseEnter={() => {
                    this.setState({
                      likeIcon: "/pictures/likeIconHover.png"
                    });
                  }}
                  onMouseOut={() => {
                    this.setState({
                      likeIcon: "/pictures/likeIcon.png"
                    });
                  }}
                />
                <img
                  id="movieNavetIcons"
                  src={this.state.dislikeIcon}
                  alt={this.state.dislikeIcon}
                  onClick={() => this.addIconsFunction("dislike")}
                  onMouseEnter={() => {
                    this.setState({
                      dislikeIcon: "/pictures/dislikeIconHover.png"
                    });
                  }}
                  onMouseOut={() => {
                    this.setState({
                      dislikeIcon: "/pictures/dislikeIcon.png"
                    });
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div id="synopsisContainer">
          <hr />
          <h3>Synopsis</h3>
          <p>{movieInfo.overview}</p>
        </div>
        <ActorsList castInfo={this.state.castInfo} />
      </div>
    );
  }
}

export default MoviePageFilterByTitle;
