import { BigInt,log ,Bytes} from "@graphprotocol/graph-ts"
import {loadToken} from "./utils/TokenController"

import {
  Treasury,
  ChangeActivated,
  ChangeQueued,
  CreateDebt,
  Deposit,
  OwnershipPulled,
  OwnershipPushed,
  RepayDebt,
  ReservesAudited,
  ReservesManaged,
  ReservesUpdated,
  RewardsMinted,
  Withdrawal,
  DepositCall,
  WithdrawCall,
  ManageCall,
  MintRewardsCall
} from "../generated/Treasury/Treasury"
import { DepositEntity} from "../generated/schema"
import { toDecimal } from "./utils/Decimals"
import {totalReservesAdded}from "./utils/YearsTotalReserves"
import {DepositAdded}from "./utils/YearsDeposit"
import {ManageAdded}from "./utils/YearsManage"
import {rewardsMintedAdded}from "./utils/YearsRewardsMinted"



/**
 * save Deposit event
 * @param event 
 */
export function handleDeposit(event: Deposit): void {
  let deposit = new DepositEntity(event.transaction.hash.toHex());
  deposit.timestamp= event.block.timestamp;
  deposit.address = event.params.token;
  deposit.value = toDecimal(event.params.value, 9); 
  deposit.amount = toDecimal(event.params.amount, 18);
  deposit.save();
}

/**
 * save deposit function with deposit event
 * @param call 
 */
export function handleDepositFunction(call: DepositCall): void {
  let id = call.transaction.hash.toHex();
  let event = DepositEntity.load(id);
  let token =loadToken(call.inputs._token,call.block.timestamp);
  DepositAdded(call.from,token.id,toDecimal(call.inputs._profit, 18),event?event.value:toDecimal(BigInt.zero(),0), toDecimal(call.inputs._amount, 18),call.block.timestamp,true);
}

/**
 * save event ReservesAudited
 * @param event 
 */
export function handleReservesAudited(event: ReservesAudited): void {
  totalReservesAdded(toDecimal(event.params.totalReserves, 9),true,event.block.timestamp);
}

/**
 * save event ReservesUpdated
 * @param event 
 */
export function handleReservesUpdated(event: ReservesUpdated): void {
  totalReservesAdded(toDecimal(event.params.totalReserves, 9),false,event.block.timestamp);
}
/**
 * save event RewardsMinted without recipient=0xe6295201cd1ff13ced5f063a5421c39a1d236f1
 * @param event 
 */
export function handleRewardsMinted(event: RewardsMinted): void {
  if(event.params.recipient.toHexString()=="0xe6295201cd1ff13ced5f063a5421c39a1d236f1c"){
    return;
  }
  rewardsMintedAdded(toDecimal(event.params.amount, 9),event.params.caller,event.params.recipient,event.block.timestamp)
}
/**
 * save Manage function 
 * @param call 
 */
export function handleManageFunction(call:ManageCall):void{
  let token =loadToken(call.inputs._token,call.block.timestamp);
  ManageAdded(call.from,token.id,toDecimal(call.inputs._amount,18),call.block.timestamp);
}

export function handleMintRewards(call: MintRewardsCall): void {
  if(call.inputs._recipient.toHexString()=="0xe6295201cd1ff13ced5f063a5421c39a1d236f1c"){
    return;
  }
}







export function handleChangeActivated(event: ChangeActivated): void {}
export function handleChangeQueued(event: ChangeQueued): void {}
export function handleCreateDebt(event: CreateDebt): void {}
export function handleOwnershipPulled(event: OwnershipPulled): void {}
export function handleOwnershipPushed(event: OwnershipPushed): void {}
export function handleRepayDebt(event: RepayDebt): void {}
export function handleReservesManaged(event: ReservesManaged): void {}
export function handleWithdrawal(event: Withdrawal): void {}
export function handleWithdrawFunction(call: WithdrawCall): void {}