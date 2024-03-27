import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import useWebSocket from "react-use-websocket";

function PlayersReady() {
  const { lastJsonMessage } = useWebSocket(
    "ws://localhost:8000/get_ready_players"
  );
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setPlayers(JSON.parse(lastJsonMessage));
  }, [lastJsonMessage]);

  return (
    <Container>
      <h2>Players Ready</h2>
      {players !== null &&
        players.map((name) => {
          return <p>{name}</p>;
        })}
      <p>Need 4 players to start!</p>
    </Container>
  );
}

export default PlayersReady;
