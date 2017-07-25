const yargs = require('yargs');
const fs = require('fs');
const _ = require('lodash');
const shell = require('shelljs');
const obj = fs.existsSync('./data.json') ? JSON.parse(fs.readFileSync('./data.json','utf8')) : {};

yargs.help('help')
  .alias('h','help')
  .option('dir',{
    alias: 'd',
    default: '.',
    global: true,
    describe: 'Project Folder'
  })
  .command('link <name>','Link a project to Project Manager')
  .command('drop <name>','Drop a linked Project')
  .command('list','Show linked projects')
  .command('work <name>','Work on current Project')

const argv = yargs.argv;
const command = argv._[0];

const isAvailable = (name) =>{
  return !Object.keys(obj).reduce((isTaken,key)=>{
    return isTaken || key == name;
  },false)
}
const { name, dir } = argv;
switch(command){
  case 'link':
    if(isAvailable(name)){
      const newObj = Object.assign({},obj,{
        [name]:__dirname
      });

    fs.writeFileSync('./data.json',JSON.stringify(newObj),'utf8',(err)=>{
      if(err){
        return console.log(err);
      }
      console.log('Success!');
    })
    }else{
      console.log('Name is already Taken');
    }
    break;
  case 'drop':
    if(!isAvailable(name)){
      const newObj = _.omit(obj,name);
      fs.writeFileSync('./data.json',JSON.stringify(newObj),'utf8',(err)=>{
        if(err){
          return console.log(err);
        }
        console.log('Success!');
      })
    } else {
      console.log("Name doesn't exists")
    }
    break;
  case 'list':
    console.log('Current Projects:\n');
    console.log("   " +Object.keys(obj).join('\n   '));

    break;
  case 'work':{
    if(!isAvailable(name)){
      console.log('Opening Shell');
      shell.exec(`cmder /start "${obj[name]}"`);
      shell.cd(obj[name]);
      shell.exec('atom .')
      shell.exec('start chrome "http://localhost:8080"')
    }
    else {
      console.log('That Project Does not exist');
    }
  }
}
