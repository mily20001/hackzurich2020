export enum Colors {
  RED = '#e20000',
  GREEN = '#00c700',
  LIGHT_GREY = '#adadad',
  BLUE = '#007bff',
}

export const getScoreColorString = (score: number) => {
  const clipped = Math.min(Math.max(0, score), 10);
  return `hsl(${120 - clipped * 12}, 100%, 50%)`;
}
