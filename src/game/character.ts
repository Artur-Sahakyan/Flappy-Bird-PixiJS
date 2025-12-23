import { Graphics, type Application } from "pixi.js";

const character = new Graphics();
const characterSize = 20;
const characterSpeed = 2;

export function drawCharacter(): void {
  character.clear();
  character.fill(0xffd700);
  character.circle(0, 0, characterSize);
  character.fill();
}

export function setCharacterInitialPosition(app: Application): void {
  character.x = characterSize * 2;
  character.y = app.screen.height / 2;
}

export function onResizeCharacter(app: Application): void {
  character.y = app.screen.height / 2;
}

export function moveCharacterRight(delta: number): void {
  character.x += characterSpeed * delta;
}

export function moveCharacterDown(moveDownSpeed: number): void {
  character.y +=  moveDownSpeed;
}

export function jump(): void {
  character.y -= 60;
}

export function getCharacter(): Graphics {
  return character;
}

