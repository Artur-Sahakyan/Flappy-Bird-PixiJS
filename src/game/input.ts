import type { Application } from "pixi.js";
import { resizeBackground } from "./background";
import { onResizeCharacter, jump, setCharacterInitialPosition } from "./character";
import { resetWalls } from "./wall";
import { getGameOver, resetGame } from "./gameState";
import { positionUI, type UI } from "./ui";
import type { GameState } from "./gameState";

export function setupResize(app: Application, ui: UI): void {
  window.addEventListener("resize", () => {
    resizeBackground(app);
    onResizeCharacter(app);
    positionUI(app, ui);
  });
}

export function setupInput(app: Application, ui: UI, state: GameState): void {
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (!getGameOver()) jump();
    }
    if (e.code === "KeyR" && getGameOver()) {
      resetGame();
      setCharacterInitialPosition(app);
      resetWalls(app.stage);
      state.score = 0;
      state.displayScore = 0;
      ui.gameOverText.visible = false;
      ui.restartText.visible = false;
    }
  });
}
