import { ITextMetrics } from './measurement';

export const wordsMetricsOfFonts = new Map<string, Map<string, ITextMetrics>>();

export const fontsMetrics = new Map<string, { height: number; baseline: number }>();
