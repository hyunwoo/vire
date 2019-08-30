
import BaseGroup from './renderGroup';
export interface ReserveAttribute {
  [key: number]: {
    values: [number, number, number, number?],
    complete: boolean,
    lerpAmount: number,
  };
}

export interface GroupAnimation {
  use: boolean;
  animationLerpValue: number;
}

export default BaseGroup;
