import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import {getNumberDayFromDate} from './Dates'
import {ReservesEntity,ReservesMinutsEntity,ReservesHoursEntity,ReservesDaysEntity , ReservesYearsEntity} from "../../generated/schema"
import {TOTAL_RESERVES_SUFFIX} from "./Suffix"

/**
 * add total reserve  to Subgraph
 * @param totalReserves 
 * @param audited 
 * @param timeStamp 
 */
export function totalReservesAdded(totalReserves: BigDecimal,audited:boolean,timeStamp:BigInt):void{

    let number:i64 =Number.parseInt(timeStamp.toString(),10) as i64;
    number*=1000;
    const date: Date = new Date( number);

    let year = ReservesYearsEntity.load(date.getUTCFullYear().toString()+TOTAL_RESERVES_SUFFIX);

    if(year==null){
        year= new ReservesYearsEntity(date.getUTCFullYear().toString()+TOTAL_RESERVES_SUFFIX);
        year.timestamp=timeStamp;
        year.maxTotalReserves=totalReserves;
        year.medianTotalReserves=totalReserves;
        year.startTotalReserves=totalReserves;
        year.minTotalReserves=totalReserves;
        year.finalTotalReserves=totalReserves;
        year.audited=audited;
        year.save();
    }else {
        if(totalReserves > year.maxTotalReserves){
            year.maxTotalReserves= totalReserves;
        }
        if(totalReserves < year.minTotalReserves){
            year.minTotalReserves= totalReserves;
        }
        if(audited){
            year.audited=audited;  
        }
        year.finalTotalReserves=totalReserves;
        year.save();
    }
    
    
    let days = year.reserversDays;
    
    let day=ReservesDaysEntity.load(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+TOTAL_RESERVES_SUFFIX);
    
    if(day==null){
        day = new ReservesDaysEntity(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+TOTAL_RESERVES_SUFFIX);
        day.timestamp=timeStamp;
        day.medianTotalReserves=totalReserves;
        day.maxTotalReserves=totalReserves;
        day.startTotalReserves=totalReserves;
        day.audited=audited;  
        day.finalTotalReserves=totalReserves;
        day.minTotalReserves=totalReserves;
        day.save();
        days.push(day.id);
        year.reserversDays=days;
        year.save();
    }else {
        if(totalReserves > day.maxTotalReserves){
            day.maxTotalReserves= totalReserves;
        }
        if(totalReserves < day.minTotalReserves){
            day.minTotalReserves= totalReserves;
        }
        if(audited){
            day.audited=audited;  
        }
        day.finalTotalReserves=totalReserves;
        day.save();
    }
    
    let hours = day.reserversHours;
    let hour =ReservesHoursEntity.load(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+TOTAL_RESERVES_SUFFIX);
    if(hour==null) {
        hour = new ReservesHoursEntity(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+TOTAL_RESERVES_SUFFIX);
        hour.timestamp=timeStamp;
        hour.medianTotalReserves=totalReserves;
        hour.maxTotalReserves=totalReserves;;
        hour.minTotalReserves=totalReserves;
        hour.finalTotalReserves=totalReserves;
        hour.startTotalReserves=totalReserves;
        hour.save();
        hour.audited=audited;  
        hours.push(hour.id);
        day.reserversHours=hours;
        day.save();
    }else {
        if(totalReserves > hour.maxTotalReserves){
            hour.maxTotalReserves= totalReserves;
        }
        if(totalReserves < hour.minTotalReserves){
            hour.minTotalReserves= totalReserves;
        }
        if(audited){
            hour.audited=audited;  
        }
        hour.finalTotalReserves=totalReserves;
        hour.save();
    }
    
    let minutes= hour.reserversMinutes;
    let minute =ReservesMinutsEntity.load(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+TOTAL_RESERVES_SUFFIX);
    if(minute==null) {
        minute = new ReservesMinutsEntity(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+TOTAL_RESERVES_SUFFIX);
        minute.timestamp=timeStamp;
        minute.medianTotalReserves=totalReserves;
        minute.maxTotalReserves=totalReserves;;
        minute.finalTotalReserves=totalReserves;
        minute.minTotalReserves=totalReserves;
        minute.audited=audited;
        minute.startTotalReserves=totalReserves;
        minute.save();
        minutes.push(minute.id);
        hour.reserversMinutes=minutes;
        hour.save();
    }else {
        if(totalReserves > minute.maxTotalReserves){
            minute.maxTotalReserves= totalReserves;
        }
        if(totalReserves < minute.minTotalReserves){
            minute.minTotalReserves= totalReserves;
        }
        if(audited){
            minute.audited=audited;  
        }
        minute.finalTotalReserves=totalReserves;
        minute.save();
    }

    let seconds = minute.reservesSeconds;
    let second =ReservesEntity.load(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+TOTAL_RESERVES_SUFFIX);//getUTCSeconds
    if(second==null) {
        second = new ReservesEntity(date.getUTCFullYear().toString()+"-"+getNumberDayFromDate(date).toString()+"-"+date.getUTCHours().toString()+"-"+date.getUTCMinutes().toString()+"-"+date.getUTCSeconds().toString()+TOTAL_RESERVES_SUFFIX);
        second.timestamp=timeStamp;
        second.totalReserves=totalReserves;
        second.audited=audited;
        second.save();
        seconds.push(second.id);
        minute.reservesSeconds=seconds;
        minute.save();
    }else {
       
        if(audited){
            second.audited=audited;  
        }
        second.save();
    }
    

}