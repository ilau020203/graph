import { BigDecimal, BigInt,Bytes } from '@graphprotocol/graph-ts';
import {getNumberDayFromDate} from './Dates'
import {DepositFunctionEntity,DepositFunctionMinuteEntity,DepositFunctionHourEntity,DepositFunctionDayEntity , DepositFunctionYearEntity,Token} from "../../generated/schema"
import {DEPOSIT_SUFFIX} from "./Suffix"

/**
 * add deposit to Subgraph
 * @param sender 
 * @param token 
 * @param profit 
 * @param value 
 * @param amount 
 * @param timeStamp 
 * @param isDeposit 
 */
export function DepositAdded(sender: Bytes,token:string,profit:BigDecimal,value:BigDecimal,amount:BigDecimal,timeStamp:BigInt,isDeposit:boolean):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = DepositFunctionYearEntity.load(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
    let lastYear =  DepositFunctionYearEntity.load(token+(date.getUTCFullYear()-1).toString()+DEPOSIT_SUFFIX);
    if(year==null){
        if(lastYear==null){
            year= new DepositFunctionYearEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.profit=profit;
            year.value=value;
            year.amount=amount;
            year.sumProfit=profit;
            year.sumValue=value;
            year.sumAmount=amount;
            year.isDeposit=isDeposit;
            year.token=token;
            let buf=year.sender;
            buf.push(sender.toHexString());
            year.sender=buf;
            year.save();
        }else{
            year= new DepositFunctionYearEntity(token+date.getUTCFullYear().toString()+DEPOSIT_SUFFIX);
            year.timestamp=timeStamp;
            year.profit=profit;
            year.value=value;
            year.amount=amount;
            year.sumProfit=profit.plus(lastYear.sumProfit);
            year.sumValue=value.plus(lastYear.sumValue);
            year.sumAmount=amount.plus(lastYear.sumAmount);
            year.isDeposit=isDeposit;
            year.token=token;
            year.sender=new Array<string>(0);
            let buf=year.sender;
            buf.push(sender.toHexString());
            year.sender=buf;
        }
    }else {
        year.sumProfit=profit.plus(year.profit);
        year.sumValue=year.value.plus(value);
        year.sumAmount=year.amount.plus(amount);
        year.value=year.value.plus(value);
        year.amount=year.amount.plus(amount);
        year.profit=profit.plus(year.profit);
        let buf=year.sender;
        buf.push(sender.toHexString());
        year.sender=buf;
        year.save();
    }
    
    
    let days = year.dayDeposit;
    
    let day=DepositFunctionDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
    
    if(day==null){
        day = new DepositFunctionDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+DEPOSIT_SUFFIX);
        day.timestamp=timeStamp;
        day.profit=profit;
        day.value=value;
        day.amount=amount;
        day.token=token;  
        day.sumAmount=year.sumAmount;
        day.sumProfit=year.sumProfit;
        day.sumValue=year.sumValue;
        let buf=day.sender;
        buf.push(sender.toHexString());
        day.sender=buf;
        day.save();
        days.push(day.id);
        year.dayDeposit=days;
        year.save();
    }else {
         day.profit=profit.plus(day.profit);
        day.value=value.plus(day.value);
        day.amount=amount.plus(day.amount);
        day.sumAmount=year.sumAmount;
        day.sumProfit=year.sumProfit;
        day.sumValue=year.sumValue;
        day.sender.push(sender.toHexString());
        day.save();
    }
    
    let hours = day.hourDeposit;
    let hour =DepositFunctionHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
    if(hour==null) {
        hour = new DepositFunctionHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+DEPOSIT_SUFFIX);
        hour.timestamp=timeStamp;
        hour.profit=profit;
        hour.value=value;;
        hour.amount=amount;
        hour.token=token;
        hour.sumAmount=year.sumAmount;
        hour.sumProfit=year.sumProfit;
        hour.sumValue=year.sumValue;
        let buf=hour.sender;
        buf.push(sender.toHexString());
        hour.sender=buf;
        hour.save();
        hours.push(hour.id);
        day.hourDeposit=hours;
        day.save();
    }else {
        hour.profit=profit.plus(hour.profit);;
        hour.value=value.plus(hour.value);
        hour.amount=amount.plus(hour.amount);
        hour.sumAmount=year.sumAmount;
        hour.sumProfit=year.sumProfit;
        hour.sumValue=year.sumValue;
        hour.sender.push(sender.toHexString());
        hour.save();
    }
    
    let minutes= hour.minuteDeposit;
    let minute =DepositFunctionMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
    if(minute==null) {
        minute = new DepositFunctionMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+DEPOSIT_SUFFIX);
        minute.timestamp=timeStamp;
        minute.profit=profit;
        minute.value=value;;
        minute.amount=amount;
        minute.token=token;
        let buf=minute.sender;
        buf.push(sender.toHexString());
        minute.sender=buf;
        minute.sumAmount=year.sumAmount;
        minute.sumProfit=year.sumProfit;
        minute.sumValue=year.sumValue;
        minute.save();
        minutes.push(minute.id);
        hour.minuteDeposit=minutes;
        hour.save();
    }else {
        minute.profit=profit.plus(minute.profit);
     
        minute.value=value.plus(minute.value);
        minute.amount=amount.plus(minute.amount);
        minute.sumAmount=year.sumAmount;
        minute.sumProfit=year.sumProfit;
        minute.sumValue=year.sumValue;
        minute.sender.push(sender.toHexString());
        minute.save();
    }

    let seconds = minute.secondDeposit;
    let second =DepositFunctionEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new DepositFunctionEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+DEPOSIT_SUFFIX);
        second.timestamp=timeStamp;
        second.profit=profit;
        second.value=value;
        second.amount=amount;
        second.token=token;
        second.sender=sender;
        second.sumAmount=year.sumAmount;
        second.sumProfit=year.sumProfit;
        second.sumValue=year.sumValue;
        second.save();
        seconds.push(second.id);
        minute.secondDeposit=seconds;
        minute.save();
    }
    

}