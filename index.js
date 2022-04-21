import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import Web3 from 'web3';
import {} from 'dotenv/config'

const collection = process.env.COLLECTION;
const baseURI = process.env.BASE_URI;

const getTotalSupply = async () => {
  const rpcURL = 'https://mainnet.infura.io/v3/' + process.env.INFURA_KEY;
  const web3 = new Web3(rpcURL);
  const abi = [{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
  const contract = new web3.eth.Contract(abi, process.env.CONTRACT);
  try {
    return await contract.methods.totalSupply().call();
  }
  catch(err) {
    console.error(err);
    return 0;
  }
};

const getJSON = async n => {
  const uri = `${baseURI}${n}.json`;
  try {
    const result = await (await fetch(uri)).text();
    await fs.writeFile(`./results/${collection}/${n}.json`, result, 'utf-8');
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
  const startToken = 4001;
  const endToken = 4100;
  const lastMinted = await getTotalSupply();
  console.log('last token minted:', lastMinted);
  //create array containing numbers from start to end
  // const tokens = [...Array(endToken - startToken).keys()].map(x => x + startToken);
  //a nicer way
  const tokens = Array.from({length: endToken - startToken + 1}, (_, i) => i + startToken);
  // const tokens = [];
  await recursiveGet(tokens);
};

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
