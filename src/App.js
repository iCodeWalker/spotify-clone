import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import Player from "./components/Player";
import { useStateValue } from "./components/StateProvider";

const spotify = new SpotifyWebApi();

function App() {
  const [{ user, token }, dispatch] = useStateValue();

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";

    const _token = hash.access_token;

    if (_token) {
      dispatch({
        type: "SET_TOKEN",
        payload: _token,
      });

      spotify.setAccessToken(_token); //giving access token to spotify api
      // now this will allow us to connect spotify with our react app.

      spotify.getMe().then((user) => {
        dispatch({
          type: "SET_USER",
          payload: user,
        });
      });

      //---- ------- ---> Fetches the user playlist from spotify

      spotify.getUserPlaylists().then((playlist) => {
        dispatch({
          type: "SET_PLAYLISTS",
          payload: playlist,
        });
      });

      spotify.getPlaylist("37i9dQZEVXcJZyENOWUFo7").then((response) => {
        console.log(response);
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          payload: response,
        });
      });
    }
  });

  return (
    <div className="app">
      {token ? <Player spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;
