const yargs = require('yargs');
const fs = require('fs');

const obj = fs.statSync('./data.json') ? JSON.parse(fs.readFileSync('./data.json','utf8')) : {};

yargs.command('set', 'start the server', (yargs) => {

  },
  (argv) => {
    const { verbose,name } = argv;
    const nameTaken = Object.keys(obj).reduce((res,key,i)=>{
      return res || key == name;
    },false)
    if (verbose) console.info(`start server on :${argv.port}`);
    if(nameTaken){
      console.log('Name Has already been taken');
    } else {
      obj[name] = __dirname;
      fs.writeFileSync('./data.json', JSON.stringify(obj) , 'utf-8');
    }

    console.log(obj);
  }
).option('verbose', {
    alias: 'v',
    default: true
  }).option('name',{
    alias:'n',
    describe: 'Name of Link'
  }).demandOption(['name'])
  .argv
