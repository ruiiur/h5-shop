let baseUrl = '';
let routerMode = 'hash';

let apiUrl = window.location.origin;
let isApp = false;

// if (process.env.NODE_ENV == 'development') {
// 	isApp = false;
// } else if (process.env.NODE_ENV == 'h5') {
// 	isApp = true;
// 	apiUrl = 'http://192.168.0.60:8081';
// } else if (process.env.NODE_ENV == 'app') {
// 	isApp = true;
// 	apiUrl = 'http://192.168.1.72:8082';
// }

export {
	baseUrl,
	routerMode,
	webSocketUrl,
	apiUrl,
	isApp
}