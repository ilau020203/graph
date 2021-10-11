import { BigDecimal, BigInt,Bytes } from '@graphprotocol/graph-ts';
import {getNumberDayFromDate} from './Dates'
import {ManageEntity,ManageMinuteEntity,ManageHourEntity,ManageDayEntity , ManageYearEntity,Token} from "../../generated/schema"
import {MANAGE_SUFFIX} from "./Suffix"
import {toDecimal}from "./Decimals"



/**
 * add information about Manage function to Subgraph
 * @param sender 
 * @param token 
 * @param profit 
 * @param value 
 * @param amount 
 * @param timeStamp 
 * @param isDeposit 
 */
export function ManageAdded(sender: Bytes,token:string,amount:BigDecimal,timeStamp:BigInt):void {

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = ManageYearEntity.load(token+date.getUTCFullYear().toString()+MANAGE_SUFFIX);
    let lastYear =  ManageYearEntity.load(token+(date.getUTCFullYear()-1).toString()+MANAGE_SUFFIX);
    if(year==null){
        if(lastYear==null){
            year= new ManageYearEntity(token+date.getUTCFullYear().toString()+MANAGE_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            year.sumAmount=amount;
            year.token=token;
            let buf=year.sender;
            buf.push(sender.toHexString());
            year.sender=buf;
            year.save();
        }else{
            year= new ManageYearEntity(token+date.getUTCFullYear().toString()+MANAGE_SUFFIX);
            year.timestamp=timeStamp;
            year.amount=amount;
            year.sumAmount=amount.plus(lastYear.sumAmount);
            year.token=token;
            year.sender=new Array<string>(0);
            let buf=year.sender;
            buf.push(sender.toHexString());
            year.sender=buf;
            year.save();
        }
    }else {
        year.sumAmount=year.amount.plus(amount);
        year.amount=year.amount.plus(amount);
        let buf=year.sender;
        buf.push(sender.toHexString());
        year.sender=buf;
        year.save();
    }
    
    
    let days = year.dayManage;
    
    let day=ManageDayEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+MANAGE_SUFFIX);
    
    if(day==null){
        day = new ManageDayEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+MANAGE_SUFFIX);
        day.timestamp=timeStamp;
        day.amount=amount;
        day.token=token;  
        day.sumAmount=year.sumAmount;
        let buf=day.sender;
        buf.push(sender.toHexString());
        day.sender=buf;
        day.save();
        days.push(day.id);
        year.dayManage=days;
        year.save();
    }else {
        // day.profit=day.profit!=null?profit.plus(day.profit):toDecimal(BigInt.zero(),0);
        day.amount=amount.plus(day.amount);
        day.sumAmount=year.sumAmount;
        day.sender.push(sender.toHexString());
        day.save();
    }
    
    let hours = day.hourManage;
    let hour =ManageHourEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+MANAGE_SUFFIX);
    if(hour==null) {
        hour = new ManageHourEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+MANAGE_SUFFIX);
        hour.timestamp=timeStamp;
        // hour.profit=profit;
        hour.amount=amount;
        hour.token=token;
        hour.sumAmount=year.sumAmount;
        let buf=hour.sender;
        buf.push(sender.toHexString());
        hour.sender=buf;
        hour.save();
        hours.push(hour.id);
        day.hourManage=hours;
        day.save();
    }else {
       
        hour.amount=amount.plus(hour.amount);
        hour.sumAmount=year.sumAmount;
        hour.sender.push(sender.toHexString());
        hour.save();
    }
    
    let minutes= hour.minuteManage;
    let minute =ManageMinuteEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+MANAGE_SUFFIX);
    if(minute==null) {
        minute = new ManageMinuteEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+MANAGE_SUFFIX);
        minute.timestamp=timeStamp;
       
        minute.amount=amount;
        minute.token=token;
        let buf=minute.sender;
        buf.push(sender.toHexString());
        minute.sender=buf;
        minute.sumAmount=year.sumAmount;
        minute.save();
        minutes.push(minute.id);
        hour.minuteManage=minutes;
        hour.save();
    }else {

        minute.amount=amount.plus(minute.amount);
        minute.sumAmount=year.sumAmount;
        minute.sender.push(sender.toHexString());
        minute.save();
    }

    let seconds = minute.secondManage;
    let second =ManageEntity.load(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+MANAGE_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new ManageEntity(token+date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+MANAGE_SUFFIX);
        second.timestamp=timeStamp;
        second.amount=amount;
        second.token=token;
        second.sender=sender.toHexString();
        second.sumAmount=year.sumAmount;
        second.save();
        seconds.push(second.id);
        minute.secondManage=seconds;
        minute.save();
    }
    

}