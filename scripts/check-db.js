
import { Client } from 'ssh2';

const config = {
  host: '195.179.238.2',
  port: 65002,
  username: 'u380355975',
  password: 'Aabkari17years_2009'
};

const conn = new Client();
conn.on('ready', () => {
  const mysqlCmd = `mysql -h 127.0.0.1 -u u380355975_rOzsG -p"r0vA!67m!Yf" -e "SHOW DATABASES;" -B`;
  conn.exec(mysqlCmd, (err, stream) => {
    let results = '';
    let errs = '';
    stream.on('data', (data) => { results += data; });
    stream.on('stderr', (data) => { errs += data; });
    stream.on('close', () => {
       if (errs) console.error('ERR:', errs);
       console.log('RESULTS:', results);
       conn.end();
    });
  });
}).connect(config);
