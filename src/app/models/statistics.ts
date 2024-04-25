export interface Statistics {
  actualWorkingTime: string;
  plannedWorkingTime: number;
  averageWorkingTime: number;
  size: number,
  data: [
    {
      x: string;
      y: number;
    }
  ];
  compData: [
    {
      x: string;
      y: number;
    }
  ]
}
