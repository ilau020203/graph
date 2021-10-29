import { BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {getNumberDayFromDate} from './Dates'
import {RewardsMintedEntity,MinuteRewardsMintedEntity,HourRewardsMintedEntity,DayRewardsMintedEntity , YearRewardsMintedEntity} from "../../generated/schema"
import {REWARDS_MINTED_SUFFIX} from "./Suffix"
/**
 * add Rewards Minted to Subgraph
 * @param amount 
 * @param caller 
 * @param recipient 
 * @param timeStamp 
 */
export function rewardsMintedAdded(amount: BigDecimal,caller:Bytes,recipient:Bytes,timeStamp:BigInt):void{

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = YearRewardsMintedEntity.load(date.getUTCFullYear().toString()+REWARDS_MINTED_SUFFIX);

    if(year==null){
        year= new YearRewardsMintedEntity(date.getUTCFullYear().toString()+REWARDS_MINTED_SUFFIX);
        year.timestamp=timeStamp;
        year.amount=amount;
        year.recipient
        let buf=year.recipient;
        buf.push(recipient);
        year.recipient=buf;
        buf=year.caller;
        buf.push(caller);
        year.caller=buf;
        year.save();
    }else {
        year.amount=year.amount.plus(amount);
        year.recipient
        let buf=year.recipient;
        buf.push(recipient);
        year.recipient=buf;
        buf=year.caller;
        buf.push(caller);
        year.caller=buf;
        year.save();
    }
    
    
    let days = year.dayMint;
    
    let day=DayRewardsMintedEntity.load(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+REWARDS_MINTED_SUFFIX);
    
    if(day==null){
        day = new DayRewardsMintedEntity(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+REWARDS_MINTED_SUFFIX);
        day.timestamp=timeStamp;
        let buf=day.recipient;
        buf.push(recipient);
        day.recipient=buf;
        day.amount=amount;
        buf=day.caller;
        buf.push(caller);
        day.caller=buf;
        day.save();
        days.push(day.id);
        year.dayMint=days;
        year.save();
    }else {
        day.amount=day.amount.plus(amount);
        let buf=day.recipient;
        buf.push(recipient);
        day.recipient=buf;
        buf=day.caller;
        buf.push(caller);
        day.caller=buf;
        day.save();
    }
    
    let hours = day.hourMint;
    let hour =HourRewardsMintedEntity.load(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+REWARDS_MINTED_SUFFIX);
    if(hour==null) {
        hour = new HourRewardsMintedEntity(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+REWARDS_MINTED_SUFFIX);
        hour.timestamp=timeStamp;
        hour.amount=amount;
        let buf=hour.recipient;
        buf.push(recipient);
        hour.recipient=buf;
        buf=hour.caller;
        buf.push(caller);
        hour.caller=buf;
        hour.save();
        hours.push(hour.id);
        day.hourMint=hours;
        day.save();
    }else {
        hour.amount=hour.amount.plus(amount);
        hour.recipient
        let buf=hour.recipient;
        buf.push(recipient);
        hour.recipient=buf;
        buf=hour.caller;
        buf.push(caller);
        hour.caller=buf;
        hour.save();
    }
    
    let minutes= hour.minuteMint;
    let minute =MinuteRewardsMintedEntity.load(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+REWARDS_MINTED_SUFFIX);
    if(minute==null) {
        minute = new MinuteRewardsMintedEntity(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+REWARDS_MINTED_SUFFIX);
        minute.timestamp=timeStamp;
        minute.amount=amount;
        let buf=minute.recipient;
        buf.push(recipient);
        minute.recipient=buf;
        buf=minute.caller;
        buf.push(caller);
        minute.caller=buf;
        minute.save();
        minutes.push(minute.id);
        hour.minuteMint=minutes;
        hour.save();
    }else {
        minute.amount=minute.amount.plus(amount);
        minute.recipient
        let buf=minute.recipient;
        buf.push(recipient);
        minute.recipient=buf;
        buf=minute.caller;
        buf.push(caller);
        minute.caller=buf;
        minute.save();
    }

    let seconds = minute.secondMint;
    let second =RewardsMintedEntity.load(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+REWARDS_MINTED_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new RewardsMintedEntity(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+REWARDS_MINTED_SUFFIX);
        second.timestamp=timeStamp;
        second.amount=amount;
        second.recipient=recipient;
        second.caller=caller;
        second.save();
        seconds.push(second.id);
        minute.secondMint=seconds;
        minute.save();
    }else {
       
        
    }
    

}