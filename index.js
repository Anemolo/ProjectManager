#!/usr/bin/env node

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
  .option('verbose',{
    alias:'v',
    default: false
  })
  .command('link <name> [desc]','Link a project to Project Manager')
  .command('drop <name> [desc]','Drop a linked Project')
  .command('list','Show linked projects')
  .command('work <name>','Work on current Project')

const argv = yargs.argv;
const command = argv._[0];
// Check if the name is free to use
const isAvailable = (name) =>{
  return !Object.keys(obj).reduce((isTaken,key)=>{
    return isTaken || key == name;
  },false)
}

const { name, dir, verbose } = argv;

switch(command){
  case 'link':
  // Check if name available for use
    if(isAvailable(name)){
      if(verbose) console.log('Creating New Object...');
      const newObj = Object.assign({},obj,{
        [name]:__dirname
      });

    if(verbose) console.log('Writing to File...');
    fs.writeFileSync('./data.json',JSON.stringify(newObj),'utf8',(err)=>{
      if(err){
        if(verbose) console.log('Error has ocurred.');
        return console.log(err);
      }
      if(verbose) console.log('Everyone Happy');
      console.log('Success!');
    })
    }else{
      console.log('Name is already Taken');
    }
    break;
  case 'drop':
  // Check if name exists.
    if(!isAvailable(name)){
      if(verbose) console.log('Creating New Object...');
      const newObj = _.omit(obj,name);

        if(verbose) console.log('Writing To File...');
      fs.writeFileSync('./data.json',JSON.stringify(newObj),'utf8',(err)=>{
        if(err){
          if(verbose) console.log('Error:',err);
          return console.log("Oops, an error has ocurred.");
        }
        return console.log('You have successfully deleted the link!');
      });

      console.log('You have successfully deleted the link!');
    } else {
      console.log("Specified Name doesn't exist")
    }
    break;
  case 'list':
    console.log('Current Projects:\n');
    console.log("   " +Object.keys(obj).join('\n   '));

    break;
  case 'work':{
    // Check if name already exists
    if(!isAvailable(name)){
      console.log('Close your Eyes for 5 seconds')
      if(verbose) console.log('Opening Shell...');
      shell.exec(`cmder /start "${obj[name]}"`);

      if(verbose) console.log('Opening Atom...');
      shell.cd(obj[name]);
      shell.exec('atom .');
      shell.exec('explorer .');

      if(verbose) console.log('Starting Chrome...');
      shell.exec('start chrome "http://localhost:8080" "https://app.asana.com"');
    }
    else {
      console.log('That Project Does not exist');
    }
  }
}
