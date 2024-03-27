import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";

function HomePage() {
  const navigate = useNavigate();
  const { lastJsonMessage } = useWebSocket(
    "ws://localhost:8000/get_ready_players"
  );
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setPlayers(JSON.parse(lastJsonMessage));
  }, [lastJsonMessage]);

  const handleSubmit = (event) => {
    fetch("http://localhost:8000/add_player/" + event.target[0].value)
      .then(() => {
        navigate("/ready");
      })
      .catch((err) => {
        console.log(err);
      });
    event.preventDefault();
  };

  return (
    <Container>
      <h1>Kaluki</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Control placeholder="Insert Name" />
        <Button type="submit">Submit</Button>
      </Form>
      <h2>Players Ready</h2>
      {players !== null &&
        players.map((name) => {
          return <p>{name}</p>;
        })}
    </Container>
  );
}

export default HomePage;
