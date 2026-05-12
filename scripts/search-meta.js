
import { Client } from 'ssh2';

const config = {
  host: '195.179.238.2',
  port: 65002,
  username: 'u380355975',
  password: 'Aabkari17years_2009'
};

const conn = new Client();
conn.on('ready', () => {
  const query = "SELECT meta_key, meta_value FROM jsync_postmeta WHERE meta_value LIKE '%Seema%' LIMIT 5";
  const mysqlCmd = `mysql -h 127.0.0.1 -u u380355975_rOzsG -p'r0vA!67m!Yf' u380355975_YwpDy -e "${query}" -B`;
  conn.exec(mysqlCmd, (err, stream) => {
    let results = '';
    stream.on('data', (data) => { results += data; });
    stream.on('close', () => {
       console.log(results);
       conn.end();
    });
  });
}).connect(config);
