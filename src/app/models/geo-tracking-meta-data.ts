/**
 * {
 *   "size": 27,
 *   "totalDistance": 5880,
 *   "accuracy": {
 *     "mean": 65.55555555555556,
 *     "stdt": 31.955759312983297
 *   }
 * }
 */
export interface GeoTrackingMetaData {
  size: number,
  totalDistance: number,
  accuracy: accuracy,
}

interface accuracy {
  mean: number,
  stdt: number,
}
