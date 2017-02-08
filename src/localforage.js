import localforage from 'localforage';

const lf = localforage.createInstance({
  driver: localforage.LOCALSTORAGE,
  name: 'pgsstore',
});

export default lf;
