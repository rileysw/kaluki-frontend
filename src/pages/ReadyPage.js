import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import PlayersReady from "../components/PlayersReady";

function ReadyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "ws://localhost:8000/update_players"
  );
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    let data = { user: location.state.user, method: "get" };
    sendJsonMessage(data);
  }, []);

  useEffect(() => {
    let response = JSON.parse(lastJsonMessage);
    if (response !== null) {
      setPlayers(response.players);
      if (response.user == location.state.user && response.method == "remove") {
        navigate("/");
      }
    }
  }, [lastJsonMessage]);

  const handleStart = () => {
    navigate("/play", { state: { user: location.state.user } });
  };

  const handleLeave = (event) => {
    let data = { user: location.state.user, method: "remove" };
    sendJsonMessage(data);
    event.preventDefault();
  };

  return (
    <Container>
      <h1>Kaluki</h1>
      <Button onClick={handleStart}>Start Game</Button>
      <Button onClick={handleLeave}>Leave</Button>
      <PlayersReady players={players} />
    </Container>
  );
}

export default ReadyPage;
