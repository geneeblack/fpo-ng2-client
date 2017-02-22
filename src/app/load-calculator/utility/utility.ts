import { Pipe, PipeTransform } from '@angular/core';

export class Utility {
    public static roundTo(number:number, digits:number):number {
        var multi = Math.pow(10, digits);
        return (Math.round(number * multi) / multi);
    }
}



