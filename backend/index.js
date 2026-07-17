// This file is used as a fallback entry point for cloud hosting platforms (like Render)
// that default to running 'node index.js' or 'node backend/index.js' when a Start Command isn't specified.
require('./dist/server.js');
