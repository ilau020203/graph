# Subgraph for treasury of olympus

## Tracks
1. Deposit event and function deposit
2. Total Reserve
3. Rewards Minted event
4.  Reserves Managed event and function manage
## Deployment

1. Run the `yarn build` command to build the subgraph, and check compilation errors before deploying.

2. Run `graph auth --product hosted-service <ACCESS_TOKEN>`

3. Deploy via `graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH NAME>`. 

## Entity nesting
We use nesting of entities, since this allows us to bypass the limitation of the `first` command by 1000 elements and this allows us to get all the necessary data from the subgaph in one request.

## hosted 
`https://api.thegraph.com/subgraphs/id/QmbLbV9gdcw1xZ5rFbmg5NmafybZC6fd5PYoV4HzCUgyXJ`