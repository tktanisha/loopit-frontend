import { Pipe, PipeTransform } from '@angular/core';
import { mapOrderStatus } from '../models/orders';
import { OrderStatus } from '../models/orders';


@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: number): OrderStatus | undefined {
    return mapOrderStatus(value);
  }
}