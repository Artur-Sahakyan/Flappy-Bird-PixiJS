import { Application, Text } from "pixi.js";
import type { GameState } from "./gameState";

export type UI = {
  scoreText: Text;
  gameOverText: Text;
  restartText: Text;
};

export function createUI(app: Application): UI {
  const scoreText = new Text({
    text: "0",
    style: { fontSize: 48, fill: 0xffffff, fontWeight: "bold" },
  });
  scoreText.anchor.set(0.5);
  scoreText.x = app.screen.width / 2;
  scoreText.y = 50;
  app.stage.addChild(scoreText);

  const gameOverText = new Text({
    text: "Game Over",
    style: { fontSize: 64, fill: 0xff0000, fontWeight: "bold" },
  });
  gameOverText.anchor.set(0.5);
  gameOverText.x = app.screen.width / 2;
  gameOverText.y = app.screen.height / 2 - 50;
  gameOverText.visible = false;
  app.stage.addChild(gameOverText);

  const restartText = new Text({
    text: "Press R to restart",
    style: { fontSize: 32, fill: 0xffffff, fontWeight: "bold" },
  });
  restartText.anchor.set(0.5);
  restartText.x = app.screen.width / 2;
  restartText.y = app.screen.height / 2 + 30;
  restartText.visible = false;
  app.stage.addChild(restartText);

  return { scoreText, gameOverText, restartText };
}

export function positionUI(app: Application, ui: UI): void {
  ui.scoreText.x = app.screen.width / 2;
  ui.gameOverText.x = app.screen.width / 2;
  ui.gameOverText.y = app.screen.height / 2 - 50;
  ui.restartText.x = app.screen.width / 2;
  ui.restartText.y = app.screen.height / 2 + 30;
}

export function bringUIToFront(app: Application, ui: UI): void {
  app.stage.setChildIndex(ui.gameOverText, app.stage.children.length - 1);
  app.stage.setChildIndex(ui.restartText, app.stage.children.length - 1);
}

export function updateGameOverFrame(app: Application, ui: UI): void {
  positionUI(app, ui);
  bringUIToFront(app, ui);
}

export function updateScoreDisplay(ui: UI, state: GameState): void {
  state.displayScore += (state.score - state.displayScore) * 0.15;
  ui.scoreText.text = Math.floor(state.displayScore).toString();
  ui.scoreText.scale.set(1 + (state.score - state.displayScore) * 0.1);
}
