import { Button, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import PlayersReady from "../components/PlayersReady";

function ReadyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleStart = () => {
    navigate("/play", { state: { name: location.state.name } });
  };

  const handleLeave = () => {
    fetch("http://localhost:8000/remove_player/" + location.state.name)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <h1>Kaluki</h1>
      <Button onClick={handleStart}>Start Game</Button>
      <Button onClick={handleLeave}>Leave</Button>
      <PlayersReady />
    </Container>
  );
}

export default ReadyPage;
