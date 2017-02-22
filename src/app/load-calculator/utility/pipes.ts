import { Pipe, PipeTransform } from '@angular/core';
import { Utility } from './utility';

export class Unit {
    public value: number;
    public unit: string;

    constructor(value: number, unit: string) {
        this.value = value;
        this.unit = unit;
    }
    toString() {
        if (this.value == 0 || this.value == null || Number.isNaN(Number(this.value)))
            return '';
        else
            return this.value + ' ' + (this.value > 1 ? this.unit + 's' : this.unit);
    }
    toUnit() {
        return new Unit(this.value, this.value > 1 ? this.unit + 's' : this.unit);
    }
}
@Pipe({ name: 'liquidpilots' })
export class LiquidPilotsPipe implements PipeTransform {
    transform(value: [any], args: string[]): any {
        return value.filter(p=>p.applicationType=='liquid')
    }
}

@Pipe({ name: 'liquidpilots' })
export class DryPilotsPipe implements PipeTransform {
    transform(value: [any], args: string[]): any {
        return value.filter(p=>p.applicationType=='dry')
    }
}

@Pipe({ name: 'unitpartials' })
export class UnitPartialsPipe implements PipeTransform {
    transform(value: number, args: string[]): any {
        var unit = args.toString();
        var retvalue = '';


        if (!value || !args)
            retvalue = '';
        if (unit == 'gallon')
            retvalue = this.convert_gallon(value, unit);
        else if (unit == 'L')
            retvalue = this.convert_liter(value, unit);
        else if (unit == 'pound')
            retvalue = this.convert_pound(value, unit);
        else if (unit == 'kg')
            retvalue = this.convert_kg(value, unit);
        else if (unit == 'floz')
            retvalue = this.convert_floz(value, unit);
        else
            retvalue = new Unit(value, unit).toString();            
        return retvalue;
    }
    convert_gallon(value, unit): string {
        var gallons = value;
        var flozs = Utility.roundTo((gallons - Math.floor(gallons)), 4) * 128.0
        var gallonsfixed = Math.floor(gallons);

        return `${new Unit(gallonsfixed, unit).toString()}  ${new Unit(flozs, 'floz').toString()}`;
    }
    convert_liter(value, unit): string {
        return new Unit(value, unit).toString();
    }
    convert_pound(value, unit): string {
        return new Unit(value, unit).toString();
    }
    convert_kg(value, unit): string {
        return new Unit(value, unit).toString();
    }
    convert_floz(value, unit): string {
        return new Unit(value, unit).toString();
    }
    pluralize(value, unit): string {
        if (value > 1)
            return value + ' ' + unit + 's';
        else
            return value + ' ' + unit;
    }
}
