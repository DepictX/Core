import { IMetrics, ITextMetrics } from '@depict-x/core';

export function isTextMetrics(metrics: IMetrics): metrics is ITextMetrics {
  return !!(metrics as ITextMetrics).content;
}
