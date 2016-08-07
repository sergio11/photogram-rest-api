/*
  Using PM2 in Cloud Providers
  Some time you do no have access to a raw CLI to start your Node.js applications.
  By using the PM2 programmatic interface, you can manage your Node.js app very easily.
 */
import pm2 from 'pm2';
let instancesp = -1;
let maxMemory = '512M';
if (process.env.WEB_CONCURRENCY) {
  instancesp = process.env.WEB_CONCURRENCY;
}
if (process.env.WEB_MEMORY) {
  maxMemory = `${process.env.WEB_MEMORY}M`;
}

pm2.connect(() => {
  pm2.start({
    script: 'server/app.js',
    name: 'instangular-rest-api',     // ----> THESE ATTRIBUTES ARE OPTIONAL:
    instances: instancesp,
    max_memory_restart: maxMemory,   // Auto restart if process taking more than XXmo
    env: {                            // If needed declare some environment variables
      NODE_ENV: 'production'
    },
  }, err => {
    if (err) return console.error('Error while launching applications', err.stack || err);
    console.log('PM2 and application has been succesfully started');
    // Display logs in standard output
    pm2.launchBus((err2, bus) => {
      console.log('[PM2] Log streaming started');
      bus.on('log:out', packet => {
        console.log('[App:%s] %s', packet.process.name, packet.data);
      });
      bus.on('log:err', packet => {
        console.error('[App:%s][Err] %s', packet.process.name, packet.data);
      });
    });
  });
});
