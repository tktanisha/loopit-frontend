import { Pipe, PipeTransform } from '@angular/core';
import { BuyStatus } from '../models/buy-request';
import { mapBuyStatus } from '../models/buy-request';


@Pipe({
  name: 'buyStatus'
})
export class BuyStatusPipe implements PipeTransform {
  transform(value: number): BuyStatus | undefined {
    return mapBuyStatus(value);
  }
}