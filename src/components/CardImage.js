import { forwardRef } from "react";
import { Image } from "react-bootstrap";
const images = require.context("../assets", true);

const CardImage = forwardRef(({ name, width, tapped }, ref) => {
  let imageSrc = "./" + name + ".png";
  return (
    <Image
      ref={ref}
      src={images(imageSrc)}
      style={{
        backgroundColor: "white",
        width: width,
        borderColor: "orange",
        borderStyle: tapped ? "solid" : "hidden",
      }}
      draggable={false}
    />
  );
});

export default CardImage;
