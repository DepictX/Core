
export interface IMetrics {
  height: number;
  width: number;
  top: number;
  left: number;
}

export interface IRenderObject {
  metrics: IMetrics;

  scrollLeft?: number;
  scrollTop?: number;

  scrollWidth?: number;
  scrollHeight?: number;
}
