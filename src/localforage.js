import localforage from 'localforage';

const lf = localforage.createInstance({
  name: 'pgsstore',
});

export default lf;
