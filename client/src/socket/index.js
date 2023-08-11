import { io } from 'socket.io-client';
import config from '../../config';

// "undefined" means the URL will be computed from the `window.location` object
const URL =
	process.env.NODE_ENV === 'production' ? undefined : config.socketURL;
export const socket = io(URL, {
	autoConnect: false,
});
