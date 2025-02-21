import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }


  // filterTableData(dataSource) {
  //   dataSource.filterPredicate = (data: any, filter: string) => {
  //     return [
  //       this.getPartyName(data.partyId),
  //       this.convertTimestampToDate(data.orderDate),
  //       this.convertTimestampToDate(data.deliveryDate),
  //       data.designNo,
  //       data.partyOrder,
  //       data.products?.[0]?.productChalanNo || '',
  //       data.orderStatus
  //     ].join(' ').toLowerCase().includes(filter);
  //   }
  // }
}
