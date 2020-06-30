export enum TimeUnit {
  year,
  month,
  week,
  day,
  weekday,
}

export enum SwipeDirection {
  /*
  DIRECTION_NONE         1
  DIRECTION_LEFT         2
  DIRECTION_RIGHT        4
  DIRECTION_UP           8
  DIRECTION_DOWN         16
  DIRECTION_HORIZONTAL   6
  DIRECTION_VERTICAL     24
  DIRECTION_ALL          30
   */

  NONE = 1,
  LEFT = 2,
  RIGHT = 4,
  UP = 8,
  DOWN = 16,
  HORIZONTAL = 6,
  VERTICAL = 24,
  ALL = 30,
}

export enum Direction {
  go = "go",
  enter = "enter",
  none = ''
}
