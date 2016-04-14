import {DOM} from '../core/elements';

export let test = () => {
 return DOM
  .div
  .append(
    DOM
    .h1
    .text('TEST')
  );
}