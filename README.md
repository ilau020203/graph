# Subgraph for treasury of olympus

#Tracks
1. Deposit event and function deposit
2. Total Reserve
3. Rewards Minted event
4.  Reserves Managed event and function manage
## Deployment


1. Run the `yarn build` command to build the subgraph, and check compilation errors before deploying.

2. Run `graph auth --product hosted-service <ACCESS_TOKEN>`

3. Deploy via `graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH NAME>`. 

