# Scrape NFT metadata

Simple process that goes and retrieves the metadata file for an NFT project.
Since IPFS has many read socket failures, the process recursively attemts to retrieve all the failed URIs from the previous run, until no failures are recorded.

## How to use

1. Clone the repo, and install dependencies (`npm i` in the project's folder)
1. Create a folder called `results` under the main folder (or it will be created automatically upon first run)
1. Rename `.env.sample` to `.env`, and provide the following values
    1. `CONTRACT=` - contract address - used to show how many minted already
    1. `BASE_URI=` - the location on IPFS to grab the metadata from. Will become available once the contract reveals
    1. `MAX_SUPPLY` - provide the max number of tokens that will be in circulation, in case the contract does not provide it
    1. `INFURA_KEY=` - Infura key to use to retrieve information - can be a free project
1. If you don't have an Infura key, you can get the `symbol`, `baseURI`, `totalSupply` and `maxSupply` from Etherscan (using the contract's address) and override the function call with the values you have. This will save several calls (and time).
1. Change the values of `tokenStart` and `tokenEnd` to control which tokens metadata to grab. The biggger the range, the longer the execution. By default we get the metadata from the first unminted token to the max available supply
1. Run with `npm start`
1. The resulting JSON files will end up in the `results/<token symbol>` folder
1. By default, we will not attempt to get a JSON we already have. If you want a "fresh" version, delete the local file (or the entire `results` folder)
