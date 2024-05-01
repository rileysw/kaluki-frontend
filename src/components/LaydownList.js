import { Container } from "react-bootstrap";
import CardImage from "./CardImage";

function LaydownList({ turn, player, laydowns }) {
  return (
    <div>
      <h5 style={{ color: turn === player ? "orange" : "white" }}>{player}</h5>
      <Container
        fluid
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "20px",
          rowGap: "20px",
        }}
      >
        {laydowns.map((laydown) => (
          <div>
            {laydown.map((card) => (
              <CardImage name={card[0]} width="3vw" />
            ))}
          </div>
        ))}
      </Container>
    </div>
  );
}

export default LaydownList;
