// Minimal WebSocket broadcast hub. One channel: every connected dashboard
// client receives every Council event as it's produced (agent activity,
// transcript turns, the final plan, and twin updates).

const { WebSocketServer } = require('ws');

let wss = null;
const clients = new Set();

function attach(server) {
  wss = new WebSocketServer({ server, path: '/council/stream' });
  wss.on('connection', (socket) => {
    clients.add(socket);
    socket.send(JSON.stringify({ type: 'connected', message: 'Sentinel Council stream online' }));
    socket.on('close', () => clients.delete(socket));
  });
}

function broadcast(event) {
  const payload = JSON.stringify(event);
  for (const socket of clients) {
    if (socket.readyState === socket.OPEN) socket.send(payload);
  }
}

module.exports = { attach, broadcast };
