import {DUM} from '../../dum-core/dum';

export let test = () => {
 return DUM
  .div
  .append(
    DUM
    .h1
    .text('TEST')
  );
}