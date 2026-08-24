const { spawn } = require('child_process');

async function testLocal() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9222;
  
  const chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://localhost:${port}/json/list`);
    const pages = await listRes.json();
    const page = pages.find(p => p.url.includes('localhost:3000') || p.type === 'page');
    if (!page || !page.webSocketDebuggerUrl) {
      console.log('No page found, pages:', pages);
      chrome.kill();
      return;
    }

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let errorCount = 0;
    ws.onopen = () => {
      console.log('Connected to debugger');
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        errorCount++;
        console.error('EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
      }
      if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'warning')) {
        console.log('CONSOLE [' + msg.params.type + ']:', msg.params.args.map(a => a.value || a.description).join(' '));
      }
    };

    await new Promise(r => setTimeout(r, 6000));
    console.log('Test finished! Error count:', errorCount);
    ws.close();
  } catch (err) {
    console.error('Diagnostic error:', err);
  } finally {
    chrome.kill();
  }
}

testLocal();

