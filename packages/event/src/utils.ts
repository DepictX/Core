type IHandlers = 'handleClick' | 'handleMousedown' | 'handleMouseup';

export function toHandler(key: string) {
  return `handle${capitalizeFirstLetter(key)}` as IHandlers;
}

export function toOn(key: string) {
  return `on${capitalizeFirstLetter(key)}`;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
