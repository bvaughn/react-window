// @flow

const WeakSetExport: typeof WeakSet =
  typeof (WeakSet: any) === 'undefined' ? (Set: any) : (WeakSet: any);
export default WeakSetExport;
