import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import PlayersReady from "../components/PlayersReady";

function HomePage() {
  const navigate = useNavigate();
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "ws://localhost:8000/setup_game"
  );
  const [user, setUser] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    let data = { user: user, method: "get" };
    sendJsonMessage(data);
  }, []);

  useEffect(() => {
    let response = JSON.parse(lastJsonMessage);
    if (response !== null) {
      setPlayers(response.players);
      if (response.user === user && response.method === "add") {
        navigate("/ready", { state: { user: user } });
      }
    }
  }, [lastJsonMessage]);

  const handleSubmit = (event) => {
    setUser(event.target[0].value);
    let data = { user: event.target[0].value, method: "add" };
    sendJsonMessage(data);
    event.preventDefault();
  };

  return (
    <Container>
      <h1>Kaluki</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Control placeholder="Insert Name" />
        <Button type="submit">Submit</Button>
      </Form>
      <PlayersReady players={players} />
    </Container>
  );
}

export default HomePage;
