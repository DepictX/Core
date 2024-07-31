export interface IFontStyle {
  [key: string]: string | number | undefined;

  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
  textDecoration?: string;
}

export interface ILayoutStyle {
  width?: number;
  height?: number;

  minWidth?: number;
  maxWidth?: number;

  minHeight?: number;
  maxHeight?: number;

  padding?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;

  zIndex?: number;

  cursor?: string;
}

export interface IStyle extends ILayoutStyle {
  [key: string]: string | number | undefined;

  wordSpacing?: string;
  wordWrap?: string;
  whiteSpace?: string;

  lineHeight?: number;
  letterSpacing?: string;
  textAlign?: string;
  textTransform?: string;
  textIndent?: string;

  textShadow?: string;
  textShadowColor?: string;
  textShadowBlur?: string;
  textShadowOffsetX?: string;
  textShadowOffsetY?: string;

  baseline?: string;
  baselineColor?: string;
  baselineStyle?: string;
  baselineWidth?: string;
  baselineRadius?: string;

  // Block
  border?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  borderRadius?: string;

  boxShadow?: string;
  boxShadowColor?: string;
  boxShadowBlur?: string;
  boxShadowSpread?: string;
  boxShadowOffsetX?: string;

  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;

  opacity?: number;
}
