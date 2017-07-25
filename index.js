#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const _ = require('lodash');
const shell = require('shelljs');
const path = require('path');

const configLocation = 'C:/Users/Anemo/AppData/Roaming/packageManager.json';
const obj = fs.existsSync(configLocation) ? JSON.parse(fs.readFileSync(configLocation,'utf8')) : {};

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
  .command('link <name> [desc]','Link a project to Project Manager').option('desc',{alias:'i',default:'No Description.'})
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

const { name, dir, verbose, desc } = argv;

switch(command){
  case 'link':
  // Check if name available for use
    if(isAvailable(name)){
        // Create new object
      if(verbose) console.log('Normalizing Path...');
      const normalizedDir = path.normalize(dir);

      if(verbose) console.log('Checking path Existance...');
      if(!fs.existsSync(normalizedDir)){
        exitError('Directory "' + dir + '" does not exist!',true);
        break;
      }

      if(verbose) console.log('Checking if path is a directory...');
      if(!fs.statSync(normalizedDir).isDirectory()){
        exitError('Path ' + dir + '" does not points to a directory!',true);
        break;
      }

      if(verbose) console.log('Old Object Keys: ',Object.keys(obj));
      if(verbose) console.log('Creating New Object...');

      const newObj = Object.assign({},obj,{
        [name]: { path:fs.realpathSync(normalizedDir), desc}
      });

      if(verbose) console.log('New Object Keys: ',Object.keys(newObj));

      if(verbose) console.log('Writing to File...');
      fs.writeFileSync(configLocation,JSON.stringify(newObj),'utf8',(err)=>{
        if(err){
          if(verbose) console.log('Error has ocurred.');
          return console.log(err);
        }
        if(verbose) console.log('Everyone Happy');
        console.log('Success!');
      })
      console.log(`New link to project ${name} has been successfully initialized!`);
    }else{
      exitError('Name ' + name + '" is already taken!',true);
    }
    break;
  case 'drop':
  // Check if name exists.
    if(!isAvailable(name)){
      if(verbose) console.log('Creating New Object...');
      const newObj = _.omit(obj,name);

        if(verbose) console.log('Writing To File...');
      fs.writeFileSync(configLocation,JSON.stringify(newObj),'utf8',(err)=>{
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
    const names = Object.keys(obj);
    if(names.length == 0) console.log('  Not a single project');
    names.forEach((cur,i)=>{
      console.log(`  ${i}. - ${cur}: ${obj[cur].desc}\n`);
    });

    break;
  case 'work':{
    // Check if name already exists
    if(!isAvailable(name)){
      console.log(`Opening ${name.toUppercase()}`);
      console.log(`Description: ${obj[name].desc}\n`);
      if(verbose) console.log('Opening Shell...');
      shell.exec(`cmder /start "${obj[name].path}"`);

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


function exitError(err,exit = true){
  if(exit){
    console.error(err);
    process.exit(1);
  }
  else {
    throw new Error(err);
  }
}
