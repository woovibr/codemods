# Internal imports Subgraph

Given a file gets all files that the file imports internally

## How it works
- start with a file
- get internal imports for the given file
- iterate on imports found

## Usage

```bash
yarn w packages/codemod/src/subGraph/getSubgraph.ts ./packages/main/src/modules/costRevenueCenter/CostRevenueCenterLoader.ts```
