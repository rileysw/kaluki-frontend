import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PlayersReady from "../components/PlayersReady";

function HomePage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    fetch("http://localhost:8000/add_player/" + event.target[0].value)
      .then(() => {
        navigate("/ready", { state: { name: event.target[0].value } });
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
      <PlayersReady />
    </Container>
  );
}

export default HomePage;
