
const oneDay:number = 1000 * 60 * 60 * 24;
const oneYear:number =31536000

export function getNumberDayFromDate(date:Date): number {
    return  Math.floor( Number.parseInt(date.toString()) -  (oneYear*getYear(date)) / oneDay);
}

export function getYear(date:Date): number {

    return  Math.floor(Number.parseInt(date.toString()) /31536000)
}