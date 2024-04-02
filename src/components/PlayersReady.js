import { Container } from "react-bootstrap";

function PlayersReady({ players }) {
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
