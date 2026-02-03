import { Application } from "pixi.js";
import { createBackground } from "./game/background";
import { drawCharacter, setCharacterInitialPosition, getCharacter } from "./game/character";
import { updateWalls } from "./game/wall";
import { createUI, positionUI } from "./game/ui";
import { setupResize, setupInput } from "./game/input";
import { createGameLoop } from "./game/gameLoop";
import type { GameState } from "./game/gameState";

async function initGame(): Promise<void> {
  const app = new Application();
  await app.init({ resizeTo: window, backgroundColor: 0x87ceeb });
  document.body.appendChild(app.canvas);

  await createBackground(app);
  const character = getCharacter();
  drawCharacter();
  setCharacterInitialPosition(app);
  app.stage.addChild(character);
  updateWalls(0, app, app.stage);

  const state: GameState = { score: 0, displayScore: 0 };
  const ui = createUI(app);
  positionUI(app, ui);

  setupResize(app, ui);
  setupInput(app, ui, state);

  app.ticker.add((ticker) => createGameLoop(app, character, ui, state)(ticker.deltaTime));
}

initGame();
