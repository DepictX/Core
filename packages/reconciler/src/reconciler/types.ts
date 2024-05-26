export interface IFlexibleProps {
  gap?: number;
  flexDirection?: 'row' | 'column';
  flexWrap?: 'nowrap' | 'wrap';
  justifyContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'baseline';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'space-between' | 'space-around';
}

export interface IFlexibleItemProps {
  flexBasic?: 'auto' | number | string; // percent
  flexGrow?: 0 | number;
  flexShrink?: 1 | number;
  // 暂不实现
  // alignSelf?: 'start' | 'end' | 'center' | 'stretch';
}
