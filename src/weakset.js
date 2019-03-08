// @flow

const WeaksetExport = typeof WeakSet === 'undefined' ? Set : WeakSet;
export default WeaksetExport;
