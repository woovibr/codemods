import { simpleFn, anotherSimpleFn } from '@test/modules';

export const consumeFn = () => {
  console.log('consumeFn');
  anotherSimpleFn();
  return simpleFn();
}
