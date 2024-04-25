export interface IEvent {
  preventDefault() : void;
  stopPropagation() : void;
  target: HTMLButtonElement;
  currentTarget: HTMLButtonElement;
  type: string;
  defaultPrevented: boolean;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
  button: number;
  buttons: number;
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  detail: number;
  eventPhase: number;
  metaKey: boolean;
}

export interface IEventProps {
  onClick?: (e: IEvent) => void;
  onMouseOver?: (e: IEvent) => void;
  onMouseOut?: (e: IEvent) => void;
  onMouseDown?: (e: IEvent) => void;
  onMouseUp?: (e: IEvent) => void;
  onMouseMove?: (e: IEvent) => void;
  onMouseEnter?: (e: IEvent) => void;
  onMouseLeave?: (e: IEvent) => void;
  onTouchStart?: (e: IEvent) => void;
  onTouchEnd?: (e: IEvent) => void;
  onTouchMove?: (e: IEvent) => void;
  onTouchCancel?: (e: IEvent) => void;
  onKeyDown?: (e: IEvent) => void;
  onKeyUp?: (e: IEvent) => void;
  onKeyPress?: (e: IEvent) => void;
  onFocus?: (e: IEvent) => void;
  onBlur?: (e: IEvent) => void;
  onChange?: (e: IEvent) => void;
  onInput?: (e: IEvent) => void;
  onSubmit?: (e: IEvent) => void;
  onReset?: (e: IEvent) => void;
  onLoad?: (e: IEvent) => void;
  onError?: (e: IEvent) => void;
  onWheel?: (e: IEvent) => void;
}
