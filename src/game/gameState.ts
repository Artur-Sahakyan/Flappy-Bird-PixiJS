let isGameOver = false;

export function setGameOver(): void {
  isGameOver = true;
}

export function getGameOver(): boolean {
  return isGameOver;
}

export function resetGame(): void {
  isGameOver = false;
}

