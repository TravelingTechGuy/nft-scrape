import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import Web3 from 'web3';
import abi from './abi.json' assert {type: "json"};
import {} from 'dotenv/config'

var tokenInfo;

const getTokenInfo = async () => {
  const rpcURL = 'https://mainnet.infura.io/v3/' + process.env.INFURA_KEY;
  const web3 = new Web3(rpcURL);
  const contract = new web3.eth.Contract(abi, process.env.CONTRACT);
  let name, symbol, totalSupply, maxSupply, baseURI;
  try {
    name = await contract.methods.name().call();
    symbol = await contract.methods.symbol().call();
    totalSupply = await contract.methods.totalSupply().call();
    //turns out not every contract uses this - will need to get baseURI from env :(
    try {
      baseURI = await contract.methods.baseURI().call();
    }
    catch(err) {
      baseURI = process.env.BASE_URI;
    }
    //if the contract does not provide max supply, take from env
    try {
      maxSupply = await contract.methods.maxSupply().call();
    }
    catch(err) {
      maxSupply = process.env.MAX_SUPPLY;
    }
  }
  catch(err) {
    console.error(err);
  }
  finally {
    return {name, symbol, totalSupply, maxSupply, baseURI};
  }
};

const fileExists = async path => !!(await fs.stat(path).catch(e => false));

const createResultsFolder = async symbol => {
  const path = `./results/${symbol}`;
  if(!await fileExists(path)) {
    await fs.mkdir(path);
  }
  return path;
};


const getJSON = async n => {
  const uri = `${tokenInfo.baseURI}${n}.json`;
  const path = `${tokenInfo.resultsFolder}/${n}.json`;
  try {
    if(await fileExists(path)) return NaN; //we already got that json
    const result = await (await fetch(uri)).text();
    await fs.writeFile(path, result, 'utf-8');
    return NaN;
  }
  catch(err) {
    return n;
  }
};

const recursiveGet = async tokens => {
  if(!tokens.length) return;
  let failed = await Promise.all(tokens.map(getJSON));
  failed = failed.filter(n => !Number.isNaN(n));
  console.log('failed: ', failed.length);
  return recursiveGet(failed);
};

const main = async () => {
  tokenInfo = await getTokenInfo();
  console.log(tokenInfo);
  const startToken = Number(tokenInfo.totalSupply) + 1; //start at the first unminted token
  const endToken = Number(tokenInfo.maxSupply);
  tokenInfo.resultsFolder = await createResultsFolder(tokenInfo.symbol);
  //create array containing numbers from start to end
  // const tokens = [...Array(endToken - startToken).keys()].map(x => x + startToken);
  //a nicer way
  const tokens = Array.from({length: endToken - startToken + 1}, (_, i) => i + startToken);
  await recursiveGet(tokens);
};

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
