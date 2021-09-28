import { BigInt } from "@graphprotocol/graph-ts"
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
  Withdrawal
} from "../generated/Treasury/Treasury"
import { ExampleEntity } from "../generated/schema"

export function handleChangeActivated(event: ChangeActivated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.managing = event.params.managing
  entity.activated = event.params.activated

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.LiquidityDepositorQueue(...)
  // - contract.LiquidityManagerQueue(...)
  // - contract.LiquidityTokenQueue(...)
  // - contract.OHM(...)
  // - contract.ReserveManagerQueue(...)
  // - contract.blocksNeededForQueue(...)
  // - contract.bondCalculator(...)
  // - contract.debtorBalance(...)
  // - contract.debtorQueue(...)
  // - contract.debtors(...)
  // - contract.deposit(...)
  // - contract.excessReserves(...)
  // - contract.isDebtor(...)
  // - contract.isLiquidityDepositor(...)
  // - contract.isLiquidityManager(...)
  // - contract.isLiquidityToken(...)
  // - contract.isReserveDepositor(...)
  // - contract.isReserveManager(...)
  // - contract.isReserveSpender(...)
  // - contract.isReserveToken(...)
  // - contract.isRewardManager(...)
  // - contract.liquidityDepositors(...)
  // - contract.liquidityManagers(...)
  // - contract.liquidityTokens(...)
  // - contract.manager(...)
  // - contract.queue(...)
  // - contract.reserveDepositorQueue(...)
  // - contract.reserveDepositors(...)
  // - contract.reserveManagers(...)
  // - contract.reserveSpenderQueue(...)
  // - contract.reserveSpenders(...)
  // - contract.reserveTokenQueue(...)
  // - contract.reserveTokens(...)
  // - contract.rewardManagerQueue(...)
  // - contract.rewardManagers(...)
  // - contract.sOHM(...)
  // - contract.sOHMQueue(...)
  // - contract.toggle(...)
  // - contract.totalDebt(...)
  // - contract.totalReserves(...)
  // - contract.valueOf(...)
}

export function handleChangeQueued(event: ChangeQueued): void {}

export function handleCreateDebt(event: CreateDebt): void {}

export function handleDeposit(event: Deposit): void {}

export function handleOwnershipPulled(event: OwnershipPulled): void {}

export function handleOwnershipPushed(event: OwnershipPushed): void {}

export function handleRepayDebt(event: RepayDebt): void {}

export function handleReservesAudited(event: ReservesAudited): void {}

export function handleReservesManaged(event: ReservesManaged): void {}

export function handleReservesUpdated(event: ReservesUpdated): void {}

export function handleRewardsMinted(event: RewardsMinted): void {}

export function handleWithdrawal(event: Withdrawal): void {}
