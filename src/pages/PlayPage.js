import { forwardRef } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { motion } from "framer-motion";

const Card = forwardRef((props, ref) => {
  return (
    <Image
      src={require("../assets/red_joker.png")}
      style={{ backgroundColor: "white", width: "5%" }}
      props={props}
      ref={ref}
      draggable={false}
    />
  );
});

const MotionCard = motion(Card);

function PlayPage() {
  return (
    <Container fluid style={{ height: "100vh" }}>
      <Row style={{ height: "30%" }}>
        <Col style={{ textAlign: "center" }}>Player 2</Col>
      </Row>
      <Row style={{ height: "30%" }}>
        <Col>Player 1</Col>
        <Col style={{ textAlign: "center" }}>Deck</Col>
        <Col style={{ textAlign: "right" }}>Player 3</Col>
      </Row>
      <Row style={{ height: "40%" }}>
        <Col style={{ textAlign: "center" }}>
          <h5>Player 4</h5>
          <MotionCard drag />
        </Col>
      </Row>
    </Container>
  );
}

export default PlayPage;
