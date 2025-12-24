import { Application } from "pixi.js";
import { createBackground, resizeBackground } from "./game/background";
import {
  drawCharacter,
  setCharacterInitialPosition,
  onResizeCharacter,
  moveCharacterRight,
  getCharacter,
  jump,
  moveCharacterDown,
} from "./game/character";
import { updateWalls, getWalls, resetWalls } from "./game/wall";

async function initGame(): Promise<void> {
  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x87ceeb,
  });

  const character = getCharacter();
  document.body.appendChild(app.canvas);

  await createBackground(app);
  window.addEventListener("resize", () => resizeBackground(app));

  drawCharacter();
  setCharacterInitialPosition(app);
  app.stage.addChild(getCharacter());
  
  updateWalls(0, app, app.stage);


  window.addEventListener("resize", () => onResizeCharacter(app));
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      jump();
    }
  });

  function update(delta: number): void {
    const top = character.height;
    const bottom = app.screen.height - character.height;
        
    if (character.y < bottom) {
      moveCharacterDown(5 * delta);
    }
  
    character.y = Math.min(Math.max(character.y, top), bottom);
    updateWalls(delta, app, app.stage);
  }

  app.ticker.add((ticker) => {
    update(ticker.deltaTime);
  });
}

initGame();
