import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import {getNumberDayFromDate,getYear} from './Dates'
import {ReservesEntity,ReservesMinutsEntity,ReservesHoursEntity,RewardsMintedEntity,ReservesDaysEntity , ReservesYearsEntity} from "../../generated/schema"
// var c=0;
// const l=0;

export function totalStakedAdded(totalStaked: BigDecimal,audited:boolean,timeStamp:BigInt):void{
    const date: Date = new Date(timeStamp.toI32());
    
    let year = ReservesYearsEntity.load(date.getFullYear().toString());

    if(year==null){
        year= new ReservesYearsEntity((date) .toString());
        // year= new ReservesYearsEntity(l.toString());

        year.maxTotalReserves=totalStaked;

        year.medianTotalReserves=totalStaked;
        year.minTotalReserves=totalStaked;
        year.save();
    }
    
    
    // let days = year.reserversDays;
    
    // let day=ReservesDaysEntity.load(getYear(date).toString()+"-"+getNumberDayFromDate(date).toString());
    // // let day=ReservesDaysEntity.load((c++).toString());
    // if(day==null){
    //     // day = new ReservesDaysEntity((c++).toString());
        
    //      day = new ReservesDaysEntity(getYear(date).toString()+"-"+getNumberDayFromDate(date).toString());
    //     day.medianTotalReserves=totalStaked;
    //     day.maxTotalReserves=totalStaked;;
    //     day.minTotalReserves=totalStaked;
    //     day.save();
    //     days.push(day.id);
    // }
    // year.reserversDays=days;
    // year.save();
    

}