const baseUrl = 'https://consulta-handicap.vercel.app/api/';

const getPlayers = (searchString) =>
	`${baseUrl}get-players?searchString=${searchString}`;

const getTarjetas = ({ profileUrl = '', matricula = '' }) =>
	`${baseUrl}get-tarjetas?profileUrl=${profileUrl}&matricula=${matricula}`;

export { getPlayers, getTarjetas };
