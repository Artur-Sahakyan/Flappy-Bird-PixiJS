import { Container } from "pixi.js";

export function isColliding(charackter: Container, wall: Container): boolean {
  const boundsA = charackter.getBounds();
  const boundsB = wall.getBounds();

  //check when charackter touch the whalls
  return (
    boundsA.x < boundsB.x + boundsB.width &&
    boundsA.x + boundsA.width > boundsB.x &&
    boundsA.y < boundsB.y + boundsB.height &&
    boundsA.y + boundsA.height > boundsB.y
  );
}

