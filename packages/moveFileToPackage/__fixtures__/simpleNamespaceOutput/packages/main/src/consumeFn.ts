import { Simple } from '@test/modules';

export const consumeFn = () => {
  console.log('consumeFn');
  return Simple.simpleFn();
}
