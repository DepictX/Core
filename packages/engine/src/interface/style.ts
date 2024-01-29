export interface IStyle {
  // Inline
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
  textDecoration?: string;

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

  width?: string;
  height?: string;

  padding?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;

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

  cursor?: string;

  zIndex?: number;

  opacity?: number;
}