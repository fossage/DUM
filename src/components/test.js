import {DOM} from '../core/elements';

export let test = DOM
  .div
  .append(
    DOM
    .h1
    .text('TEST')
  );