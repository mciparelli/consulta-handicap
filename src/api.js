const baseUrl = 'https://consulta-handicap.vercel.app/api/';

const getPlayers = (searchString) =>
	`${baseUrl}getPlayers?searchString=${searchString}`;

const getTarjetas = ({ profileUrl = '', matricula = '' }) =>
	`${baseUrl}getTarjetas?profileUrl=${profileUrl}&matricula=${matricula}`;

export { getPlayers, getTarjetas };
