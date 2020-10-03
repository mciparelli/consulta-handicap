const baseUrl = 'https://us-central1-polla-878b5.cloudfunctions.net/';

const getPlayers = (searchString) =>
  `${baseUrl}getPlayers?searchString=${searchString}`;

const getTarjetas = ({ profileUrl = '', matricula = '' }) =>
  `${baseUrl}getTarjetas?profileUrl=${profileUrl}&matricula=${matricula}`;

export { getPlayers, getTarjetas };
