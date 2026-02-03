import { Container } from "pixi.js";

export function isColliding(character: Container, wall: Container): boolean {
  const boundsA = character.getBounds();
  const boundsB = wall.getBounds();
  return (
    boundsA.x < boundsB.x + boundsB.width &&
    boundsA.x + boundsA.width > boundsB.x &&
    boundsA.y < boundsB.y + boundsB.height &&
    boundsA.y + boundsA.height > boundsB.y
  );
}

