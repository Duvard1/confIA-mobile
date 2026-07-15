const { spawn } = require('node:child_process');

const expoPort = '8081';
const ngrokCommand = process.platform === 'win32' ? 'ngrok.cmd' : 'ngrok';

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getTunnelUrl() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4040/api/tunnels');
      if (response.ok) {
        const payload = await response.json();
        const tunnel = Array.isArray(payload.tunnels)
          ? payload.tunnels.find((entry) => entry.public_url && entry.proto === 'https') || payload.tunnels[0]
          : null;

        if (tunnel?.public_url) {
          return tunnel.public_url;
        }
      }
    } catch {
      // Keep waiting for ngrok to finish booting.
    }

    await wait(1000);
  }

  throw new Error('No se pudo obtener la URL pública de ngrok.');
}

async function main() {
  const ngrok = spawn(ngrokCommand, ['http', expoPort], {
    shell: true,
    stdio: ['ignore', 'inherit', 'inherit'],
    windowsHide: true,
  });

  const cleanup = () => {
    if (!ngrok.killed) {
      ngrok.kill();
    }
  };

  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit(130);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(143);
  });

  const publicUrl = await getTunnelUrl();
  console.log(`\nngrok URL: ${publicUrl}\n`);

  const expo = spawn('npx', ['expo', 'start'], {
    env: {
      ...process.env,
      EXPO_PACKAGER_PROXY_URL: publicUrl,
    },
    shell: true,
    stdio: 'inherit',
    windowsHide: true,
  });

  expo.on('exit', (code) => {
    cleanup();
    process.exit(code ?? 0);
  });

  ngrok.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`ngrok terminó con código ${code}.`);
      expo.kill();
      process.exit(code);
    }
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});