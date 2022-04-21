# Scrape NFT metadata

Simple process that goes and retrieves the metadata file for an NFT project.
Since IPFS has many read socket failures, the process recursively attemts to retrieve all the failed URIs from the previous run, until no failures are recorded.

## How to use

1. Clone the repo, and install dependencies
1. Create a folder called `results` under the main folder
1. Rename `.env.sample` to `.env`, and provide the following values
    1. `COLLECTION=` - name of folder under results to gather the files
    1. `CONTRACT=` - contract address - used to show how many minted already
    1. `BASE_URI=` - the location on IPFS to grab the metadata from. Will become available once the contract reveals
    1. `INFURA_KEY=` - Infura key to use to retrieve information - can be a free project
    1. If you do not want/need contract information, you can coment out the line that calls `getTotalSupply()` in the `main` function, and skip the `CONTRACT` and `INFURA_KEY` variables
1. Change the values of `tokenStart` and `tokenEnd` to control which tokens metadata to grab. The biggger the range, the longer the execution
1. Run with `npm start`
