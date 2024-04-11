import { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Reorder } from "framer-motion";

function PlayPage() {
  const location = useLocation();
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);

  const images = require.context("../assets", true);
  const CardImage = ({ name }) => {
    let imageSrc = "./" + name + ".png";
    return (
      <Image
        src={images(imageSrc)}
        style={{ backgroundColor: "white", width: "5vw" }}
        draggable={false}
      />
    );
  };

  useEffect(() => {
    // initialize players
    let playerOrder = [];
    for (
      let i = location.state.players.indexOf(location.state.user);
      i < location.state.players.length;
      i++
    ) {
      playerOrder.push(location.state.players[i]);
    }
    for (
      let i = 0;
      i < location.state.players.indexOf(location.state.user);
      i++
    ) {
      playerOrder.push(location.state.players[i]);
    }
    setPlayers(playerOrder);

    // initialize hand
    fetch("http://localhost:8000/player_hand/" + location.state.user)
      .then((res) => res.json())
      .then((data) => setHand(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container fluid style={{ height: "100vh" }}>
      <Row style={{ height: "30%" }}>
        <Col style={{ textAlign: "center" }}>
          <h5>{players[2]}</h5>
        </Col>
      </Row>
      <Row style={{ height: "30%" }}>
        <Col>
          <h5>{players[1]}</h5>
        </Col>
        <Col style={{ textAlign: "center" }}>
          <CardImage name="back@2x" />
        </Col>
        <Col style={{ textAlign: "right" }}>
          <h5>{players[3]}</h5>
        </Col>
      </Row>
      <Row style={{ height: "40%" }}>
        <Col style={{ textAlign: "center" }}>
          <h5>{players[0]}</h5>
          <Reorder.Group
            axis="x"
            values={hand}
            onReorder={setHand}
            style={{ listStyleType: "none" }}
          >
            {hand !== null &&
              hand.map((card) => {
                return (
                  <Reorder.Item
                    key={card}
                    value={card}
                    style={{ display: "inline-block" }}
                  >
                    <CardImage name={card[0]} />
                  </Reorder.Item>
                );
              })}
          </Reorder.Group>
        </Col>
      </Row>
    </Container>
  );
}

export default PlayPage;
