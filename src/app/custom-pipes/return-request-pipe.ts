import { Pipe, PipeTransform } from '@angular/core';
import { ReturnStatus } from '../models/return-request';
import { mapReturnStatus } from '../models/return-request';


@Pipe({
  name: 'returnStatus'
})
export class ReturnStatusPipe implements PipeTransform {
  transform(value: number): ReturnStatus | undefined {
    return mapReturnStatus(value);
  }
}