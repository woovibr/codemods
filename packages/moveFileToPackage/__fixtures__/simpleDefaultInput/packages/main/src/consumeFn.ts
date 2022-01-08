import simpleFn, { anotherSimpleFn } from './simple';

export const consumeFn = () => {
  console.log('consumeFn');
  anotherSimpleFn();
  return simpleFn();
}
