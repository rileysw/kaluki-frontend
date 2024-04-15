import { forwardRef, useEffect, useState, useRef } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { Reorder } from "framer-motion";

function PlayPage() {
  const location = useLocation();
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "ws://localhost:8000/play_game"
  );
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState("");
  const [hand, setHand] = useState([]);
  const [trashCard, setTrashCard] = useState([]);
  const trashRef = useRef(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const images = require.context("../assets", true);
  const CardImage = forwardRef(({ name }, ref) => {
    let imageSrc = "./" + name + ".png";
    return (
      <Image
        ref={ref}
        src={images(imageSrc)}
        style={{ backgroundColor: "white", width: "5vw" }}
        draggable={false}
      />
    );
  });

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

    // initialize turn, hand, and hasDrawn
    fetch("http://localhost:8000/game_info/" + location.state.user)
      .then((res) => res.json())
      .then((data) => {
        setTurn(data.turn);
        setHand(data.hand);
        setHasDrawn(data.hasDrawn);
        if (data.trashCard !== null) {
          setTrashCard(data.trashCard);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let response = JSON.parse(lastJsonMessage);
    if (response !== null) {
      if (response.method === "trash") {
        if (response.user === location.state.user) {
          setHand(response.hand);
        }
        setTrashCard(response.trashCard);
        setTurn(response.turn);
        setHasDrawn(response.hasDrawn);
      }
    }
  }, [turn, lastJsonMessage]);

  const drawCard = () => {
    let data = { user: location.state.user, hand: hand };
    fetch("http://localhost:8000/draw_card/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        setHand(data.hand);
        setHasDrawn(data.hasDrawn);
      })
      .catch((err) => console.log(err));
  };

  const trash = (cardId) => {
    let data = {
      user: location.state.user,
      method: "trash",
      cardId: cardId,
      hand: hand,
    };
    sendJsonMessage(data);
  };

  return (
    <Container fluid style={{ height: "100vh" }}>
      <Row style={{ height: "30%" }}>
        <Col style={{ textAlign: "center" }}>
          <h5 style={{ color: turn === players[2] ? "orange" : "white" }}>
            {players[2]}
          </h5>
        </Col>
      </Row>
      <Row style={{ height: "30%" }}>
        <Col>
          <h5 style={{ color: turn === players[1] ? "orange" : "white" }}>
            {players[1]}
          </h5>
        </Col>
        <Col style={{ textAlign: "center" }}>
          <Row>
            <Col>
              <Button
                variant="link"
                onClick={drawCard}
                disabled={location.state.user !== turn || hasDrawn}
              >
                <CardImage name="back@2x" />
              </Button>
            </Col>
            <Col>
              <CardImage
                ref={trashRef}
                name={trashCard.length === 0 ? "back@2x" : trashCard[0]}
              />
            </Col>
          </Row>
        </Col>
        <Col style={{ textAlign: "right" }}>
          <h5 style={{ color: turn === players[3] ? "orange" : "white" }}>
            {players[3]}
          </h5>
        </Col>
      </Row>
      <Row style={{ height: "40%", textAlign: "center" }}>
        <h5 style={{ color: turn === players[0] ? "orange" : "white" }}>
          {players[0]}
        </h5>
        <Col>
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
                    drag
                    onDragEnd={(_, info) => {
                      if (
                        location.state.user === turn &&
                        hasDrawn &&
                        trashRef.current.getBoundingClientRect().left <=
                          info.point.x &&
                        info.point.x <=
                          trashRef.current.getBoundingClientRect().right &&
                        trashRef.current.getBoundingClientRect().top <=
                          info.point.y &&
                        info.point.y <=
                          trashRef.current.getBoundingClientRect().bottom
                      ) {
                        trash(card[2]);
                      }
                    }}
                  >
                    <CardImage name={card[0]} />
                  </Reorder.Item>
                );
              })}
          </Reorder.Group>
        </Col>
        <Col xs={2}>
          <Button disabled={location.state.user !== turn || !hasDrawn}>
            Laydown
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default PlayPage;
