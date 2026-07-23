export type Run = {
  _id: string;
  pathName: string;
  distanceMiles: number;
  durationSeconds: number;
  waypoints: number[][];
  createdAt: string;
};