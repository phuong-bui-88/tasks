#!/usr/bin/env node

const http = require('http');

// Function to check if a port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use!`);
        resolve(false);
      } else {
        console.error(`Error checking port ${port}:`, err);
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      console.log(`Port ${port} is available`);
      resolve(true);
    });
    
    server.listen(port, '0.0.0.0');
  });
}

// Check Vite server port
async function main() {
  console.log('Checking development server connectivity...');
  const port = 4000;
  const isAvailable = await checkPort(port);
  
  if (!isAvailable) {
    console.log(`
Troubleshooting steps:
1. Check if another process is using port ${port}
2. Verify network/firewall settings
3. Try changing the port in vite.config.js
4. Ensure your container/environment has proper network access
`);
  } else {
    console.log(`Port ${port} is available for the Vite dev server`);
  }
}

main().catch(console.error);
