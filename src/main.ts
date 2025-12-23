import { Application } from "pixi.js";
import { createBackground, resizeBackground } from "./game/background";
import {
  drawCharacter,
  setCharacterInitialPosition,
  onResizeCharacter,
  moveCharacter,
  getCharacter,
} from "./game/character";

async function initGame(): Promise<void> {
  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x87ceeb,
  });

  document.body.appendChild(app.canvas);

  await createBackground(app);
  window.addEventListener("resize", () => resizeBackground(app));

  drawCharacter();
  setCharacterInitialPosition(app);
  app.stage.addChild(getCharacter());

  window.addEventListener("resize", () => onResizeCharacter(app));

  function update(delta: number): void {
    moveCharacter(delta);
  }

  app.ticker.add((ticker) => {
    update(ticker.deltaTime);
  });
}

initGame();
