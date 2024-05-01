import { useEffect, useState, useRef } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { Reorder } from "framer-motion";

import CardImage from "../components/CardImage";
import LaydownList from "../components/LaydownList";

function PlayPage() {
  const location = useLocation();
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "ws://localhost:8000/play_game"
  );
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState("");
  const [hand, setHand] = useState([]);
  const [handTapped, setHandTapped] = useState([]);
  const [trashCard, setTrashCard] = useState([]);
  const trashRef = useRef(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isLaydown, setIsLayDown] = useState(false);
  const [allLaydowns, setAllLaydowns] = useState({});

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

    // initialize states
    fetch("http://localhost:8000/game_info/" + location.state.user)
      .then((res) => res.json())
      .then((data) => {
        setTurn(data.turn);
        setHand(data.hand);
        setHandTapped(new Array(data.hand.length).fill(false));
        setAllLaydowns(data.allLaydowns);
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
      if (response.user === location.state.user) {
        setHand(response.hand);
        setHandTapped(new Array(response.hand.length).fill(false));
      }
      if (response.method === "trash") {
        setTrashCard(response.trashCard);
        setTurn(response.turn);
        setHasDrawn(response.hasDrawn);
      } else if (response.method === "laydown") {
        setAllLaydowns(response.allLaydowns);
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
        setHandTapped(new Array(data.hand.length).fill(false));
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

  const addLaydown = () => {
    let laydown = [];
    for (let i = 0; i < handTapped.length; i++) {
      if (handTapped[i]) {
        laydown.push(hand[i]);
      }
    }
    let data = {
      user: location.state.user,
      method: "laydown",
      hand: hand,
      laydown: laydown,
    };
    sendJsonMessage(data);
  };

  return (
    <Container fluid style={{ height: "100vh" }}>
      <Row style={{ height: "30%", textAlign: "center" }}>
        <LaydownList
          turn={turn}
          player={players[2]}
          laydowns={
            allLaydowns[players[2]] !== undefined ? allLaydowns[players[2]] : []
          }
        />
      </Row>
      <Row style={{ height: "30%" }}>
        <Col>
          <LaydownList
            turn={turn}
            player={players[1]}
            laydowns={
              allLaydowns[players[1]] !== undefined
                ? allLaydowns[players[1]]
                : []
            }
          />
        </Col>
        <Col
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="link"
            onClick={drawCard}
            disabled={location.state.user !== turn || hasDrawn}
          >
            <CardImage name="back@2x" width="5vw" />
          </Button>
          <Button variant="link">
            <CardImage
              ref={trashRef}
              name={trashCard.length === 0 ? "back@2x" : trashCard[0]}
              width="5vw"
            />
          </Button>
        </Col>
        <Col style={{ textAlign: "right" }}>
          <LaydownList
            turn={turn}
            player={players[3]}
            laydowns={
              allLaydowns[players[3]] !== undefined
                ? allLaydowns[players[3]]
                : []
            }
          />
        </Col>
      </Row>
      <Row style={{ height: "40%", textAlign: "center" }}>
        <LaydownList
          turn={turn}
          player={players[0]}
          laydowns={
            allLaydowns[players[0]] !== undefined ? allLaydowns[players[0]] : []
          }
        />
        <Col>
          <Reorder.Group
            axis="x"
            values={hand}
            onReorder={setHand}
            style={{ listStyleType: "none" }}
          >
            {hand !== null &&
              hand.map((card, index) => {
                return (
                  <Reorder.Item
                    key={card}
                    value={card}
                    style={{ display: "inline-block" }}
                    drag
                    onTap={() => {
                      if (isLaydown) {
                        let copyHandTapped = [...handTapped];
                        if (copyHandTapped[index]) {
                          copyHandTapped[index] = false;
                        } else {
                          copyHandTapped[index] = true;
                        }
                        setHandTapped(copyHandTapped);
                      }
                    }}
                    onDragEnd={(_, info) => {
                      if (
                        location.state.user === turn &&
                        hasDrawn &&
                        !isLaydown &&
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
                    <CardImage
                      name={card[0]}
                      width="5vw"
                      tapped={handTapped[index]}
                    />
                  </Reorder.Item>
                );
              })}
          </Reorder.Group>
        </Col>
        <Col xs={2}>
          {isLaydown ? (
            <div>
              <Button
                onClick={addLaydown}
                disabled={handTapped.filter((value) => value).length === 0}
              >
                Add Laydown
              </Button>
              <Button
                onClick={() => {
                  setHandTapped(new Array(hand.length).fill(false));
                  setIsLayDown(false);
                }}
              >
                Exit Laydown
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsLayDown(true)}
              disabled={location.state.user !== turn || !hasDrawn}
            >
              Laydown
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default PlayPage;
