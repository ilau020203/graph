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
  Withdrawal,
  DepositCall,
  WithdrawCall
} from "../generated/Treasury/Treasury"
import { ExampleEntity,DepositEntity,DepositFunctionEntity ,DebtEntity, ReservesManagedEntity,RewardsMintedEntity} from "../generated/schema"
import { toDecimal } from "./utils/Decimals"
import {totalReservesAdded}from "./utils/YearsTotalReserves"

/***Действия:**

- Deposit — депонирует резервы / позволяет утвержденным адресам депонировать актив для OHM. Параметры для агрегирования: sender, token, amount, value.
- Withdrawal — выводит резервы / позволяет утвержденным адресам сжигать OHM для резервов. Параметры для агрегирования: sender, token, amount, value.
- Debt creation — позволяет утвержденным адресам заимствовать резервы. Параметры для агрегирования: debtor, token, amount, value.
- Debt repay — позволяет утвержденным адресам погашать заимствованные резервы либо резервами, либо OHM. Параметры для агрегирования: debtor, token, amount, value.
- Manage reserves — позволяет утвержденным адресам выводить активы. Параметры для агрегирования: manager (роль для ликвидного или резервного менеджера - скорее всего, кто-то из команды или внешний контракт), token, amount.
- Mint rewards — отправляет вознаграждения за epoch в staking контракт. Параметры для агрегирования:  caller (sender), recipient, amount.

**Действия по оценке резервов:**

- Audit reserves — оценка общих резервов (токены резервов + токены ликвидности), проводимая внешним менеджером.  Параметры для агрегирования:  total reserves.
- Update reserves — обновить общую стоимость резервов. Параметры для агрегирования: total reserves.

**Действия по управлению:**

- Change queued — любые изменения, касающиеся управления очередью.
- Change activated — произошли какие-либо изменения, касающиеся управления (например, кто может расходовать резервы).
*/




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

export function handleCreateDebt(event: CreateDebt): void {
  let debt = new DebtEntity(event.transaction.from.toHex())
  debt.value= toDecimal(event.params.value, 18); 
  debt.amount = toDecimal(event.params.amount, 18);
  debt.debtor =event.params.debtor;
  debt.token =event.params.token;
  debt.creation=true;
  debt.save();
}

export function handleDeposit(event: Deposit): void {
  let deposit = new DepositEntity(event.transaction.hash.toHex());
  deposit.timestamp= event.block.timestamp;
  deposit.address = event.params.token;
  deposit.value =toDecimal(event.params.value, 18); 
  deposit.amount = toDecimal(event.params.amount, 18);
  deposit.save();
}


export function handleDepositFunction(call: DepositCall): void {
  let id = call.transaction.hash.toHex();
  let event = DepositEntity.load(id);
  let deposit = new DepositFunctionEntity(id);
  deposit.value=event?event.value:toDecimal(BigInt.zero(),0);
  deposit.amount= toDecimal(call.inputs._amount, 18);
  deposit.sender =call.from;
  deposit.timestamp= call.block.timestamp;
  deposit.profit= toDecimal(call.inputs._profit, 18);
  deposit.isDeposit=true;
  deposit.save();
}

export function handleOwnershipPulled(event: OwnershipPulled): void {}

export function handleOwnershipPushed(event: OwnershipPushed): void {}

export function handleRepayDebt(event: RepayDebt): void {
  let debt = new DebtEntity(event.transaction.from.toHex())
  debt.value= toDecimal(event.params.value, 18); 
  debt.amount = toDecimal(event.params.amount, 18);
  debt.debtor =event.params.debtor;
  debt.token =event.params.token;
  debt.creation=false;
  debt.save();
}

export function handleReservesAudited(event: ReservesAudited): void {
  totalReservesAdded(toDecimal(event.params.totalReserves, 18),true,event.block.timestamp);
}

export function handleReservesManaged(event: ReservesManaged): void {
  let reservesManaged=new ReservesManagedEntity(event.transaction.hash.toHex());
  reservesManaged.token= event.params.token;
  reservesManaged.amount=toDecimal(event.params.amount, 18);
  reservesManaged.timestamp=event.block.timestamp;
  reservesManaged.save();
}


export function handleReservesUpdated(event: ReservesUpdated): void {
  totalReservesAdded(toDecimal(event.params.totalReserves, 18),false,event.block.timestamp);
}

export function handleRewardsMinted(event: RewardsMinted): void {
  let reservesManaged=new RewardsMintedEntity(event.transaction.hash.toHex());
  reservesManaged.recipient= event.params.recipient;
  reservesManaged.caller = event.params.caller;
  reservesManaged.amount=toDecimal(event.params.amount, 18);
  reservesManaged.timestamp=event.block.timestamp;
  reservesManaged.save();
}

export function handleWithdrawal(event: Withdrawal): void {
  let withdrawal = new DepositEntity(event.transaction.hash.toHex());
  withdrawal.timestamp= event.block.timestamp;
  withdrawal.address = event.params.token;
  withdrawal.value =toDecimal(event.params.value, 18); 
  withdrawal.amount = toDecimal(event.params.amount, 18);
  withdrawal.save();
}


export function handleWithdrawFunction(call: WithdrawCall): void {
  let id = call.transaction.hash.toHex();
  let event = DepositEntity.load(id);
  let deposit = new DepositFunctionEntity(id);
  deposit.value=event?event.value:toDecimal(BigInt.zero(),0);
  deposit.amount= toDecimal(call.inputs._amount, 18);
  deposit.sender =call.from;
  deposit.timestamp= call.block.timestamp;
  deposit.isDeposit=false;
  deposit.save();
}