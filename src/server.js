import config from './config/index.js';
import app from './app.js';

const { port } = config;
const server = app.listen(port, () => console.log(`listening at http://localhost:${port}`));
