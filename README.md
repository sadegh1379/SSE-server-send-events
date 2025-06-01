# Server-Sent Events (SSE) Implementation

## Overview
Server-Sent Events (SSE) is a server push technology enabling a client to receive automatic updates from a server via an HTTP connection. This implementation provides a robust solution for real-time, one-way communication from server to client.

## Features
- Real-time server-to-client updates
- Automatic reconnection handling
- Event-based communication
- Lightweight and efficient
- Native browser support
- No additional dependencies required

## Installation

```bash
# Clone the repository
git clone https://github.com/sadegh1379/SSE-server-send-events.git

# Navigate to the project directory
cd backend && npm install && npm run dev

cd frontend && npm install && npm run dev

```

## Usage

### Server-Side Implementation

```javascript
import express from 'express';
const app = express();

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send data to client
  const sendData = () => {
    res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`);
  };

  // Send data every second
  const intervalId = setInterval(sendData, 1000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
  });
});

app.listen(3000, () => {
  console.log('SSE Server running on port 3000');
});
```

### Client-Side Implementation

```javascript
const eventSource = new EventSource('/events');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

eventSource.onerror = (error) => {
  console.error('EventSource failed:', error);
  eventSource.close();
};
```

## API Reference

### Server-Side Methods

- `res.write()`: Send data to the client
- `res.end()`: Close the connection
- `req.on('close')`: Handle client disconnection

### Client-Side Events

- `onmessage`: Triggered when a message is received
- `onerror`: Triggered when an error occurs
- `onopen`: Triggered when the connection is established

## Error Handling

The implementation includes automatic reconnection handling. If the connection is lost, the client will automatically attempt to reconnect with an exponential backoff strategy.

## Browser Support

SSE is supported in all modern browsers:
- Chrome 6+
- Firefox 6+
- Safari 5+
- Opera 11+
- Edge 79+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
