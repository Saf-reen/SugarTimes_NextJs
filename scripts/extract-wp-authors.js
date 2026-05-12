
import { Client } from 'ssh2';
import fs from 'fs';

const config = {
  host: '195.179.238.2',
  port: 65002,
  username: 'u380355975',
  password: 'Aabkari17years_2009'
};

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection Ready');
  const configPath = './domains/sugartimes.co.in/public_html/wp-config.php';
  conn.exec(`cat ${configPath}`, (err, stream) => {
    let content = '';
    stream.on('data', (data) => { content += data; });
    stream.on('close', () => {
       const dbName = content.match(/define\(\s*'DB_NAME',\s*'([^']+)'\s*\)/)?.[1];
       const dbUser = content.match(/define\(\s*'DB_USER',\s*'([^']+)'\s*\)/)?.[1];
       const dbPass = content.match(/define\(\s*'DB_PASSWORD',\s*'([^']+)'\s*\)/)?.[1];
       const dbHost = content.match(/define\(\s*'DB_HOST',\s*'([^']+)'\s*\)/)?.[1] || 'localhost';
       const prefix = content.match(/\$table_prefix\s*=\s*'([^']+)'/)?.[1] || 'wp_';
       
       console.log(`DB: ${dbName}, User: ${dbUser}, Host: ${dbHost}, Prefix: ${prefix}`);
       
       if (dbName && dbUser && dbPass) {
          const query = `SELECT p.ID as wpId, u.display_name as authorName FROM ${prefix}posts p JOIN ${prefix}users u ON p.post_author = u.ID WHERE p.post_type = 'post'`;
          const mysqlCmd = `mysql -h ${dbHost} -u ${dbUser} -p'${dbPass}' ${dbName} -e "${query}" -B`;
          console.log('Running MySQL command...');
          conn.exec(mysqlCmd, (err, stream) => {
             let results = '';
             let errLog = '';
             stream.on('data', (data) => { results += data; });
             stream.on('stderr', (data) => { errLog += data; });
             stream.on('close', () => {
                if (errLog) console.error('MYSQL ERR:', errLog);
                fs.writeFileSync('wp_author_mapping.tsv', results);
                console.log(`SUCCESS: Saved ${results.split('\n').length} lines to wp_author_mapping.tsv`);
                conn.end();
             });
          });
       } else {
          console.error('Could not parse DB info');
          conn.end();
       }
    });
  });
}).connect(config);
