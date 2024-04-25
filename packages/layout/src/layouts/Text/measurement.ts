import { fontsMetrics, wordsMetricsOfFonts } from './storage';
import { getCanvasContext } from './utils';

export interface ITextMetrics extends TextMetrics {
  height: number;
  baseline: number;
}

export function measureText(
  text: string,
  fontFamily: string,
  fontSize: number,
): ITextMetrics {
  const ctx = getCanvasContext();

  const fontStr = `${fontSize}px ${fontFamily}`;
  let wordsMetrics = wordsMetricsOfFonts.get(fontStr);

  if (wordsMetrics && wordsMetrics.has(text)) return wordsMetrics.get(text)!;

  if (!wordsMetrics) {
    wordsMetrics = new Map();
    wordsMetricsOfFonts.set(fontStr, wordsMetrics);
  }

  const fontMetrics = measureFont(fontFamily, fontSize);

  ctx.font = fontStr;

  const textMetrics = ctx.measureText(text);
  const wordMetrics: ITextMetrics = {
    ...fontMetrics,
    width: textMetrics.width,
    actualBoundingBoxAscent: textMetrics.actualBoundingBoxAscent,
    actualBoundingBoxDescent: textMetrics.actualBoundingBoxDescent,
    actualBoundingBoxLeft: textMetrics.actualBoundingBoxLeft,
    actualBoundingBoxRight: textMetrics.actualBoundingBoxRight,
    fontBoundingBoxAscent: textMetrics.fontBoundingBoxAscent,
    fontBoundingBoxDescent: textMetrics.fontBoundingBoxDescent,
    alphabeticBaseline: 0,
    emHeightAscent: 0,
    emHeightDescent: 0,
    hangingBaseline: 0,
    ideographicBaseline: 0,
  };

  wordsMetrics.set(text, wordMetrics);
  return wordMetrics;
}

export function measureFont(fontFamily: string, fontSize: number) {
  const fontStr = `${fontSize}px ${fontFamily}`;

  if (fontsMetrics.has(fontStr)) {
    return fontsMetrics.get(fontStr)!;
  }

  let base = fontsMetrics.get(fontFamily);

  if (!base) {
    const ctx = getCanvasContext();
    ctx.font = `1000px ${fontFamily}`;
    const textMetrics = ctx.measureText('bdfghijklpqty');

    base = {
      height:
        // TODO: use actual * line height
        textMetrics.fontBoundingBoxAscent +
        textMetrics.fontBoundingBoxDescent,
      baseline: textMetrics.actualBoundingBoxAscent,
    };
  }

  const ratio = fontSize / 1000;
  const metrics = {
    height: base.height * ratio,
    baseline: base.height * ratio,
  };
  fontsMetrics.set(fontStr, metrics);
  return metrics;
}
