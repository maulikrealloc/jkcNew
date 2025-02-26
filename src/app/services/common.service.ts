import { Injectable, ViewChild } from '@angular/core';
import { FirebaseCollectionService } from './firebase-collection.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(private firebaseCollectionService: FirebaseCollectionService) { }

  commonApiCalled(result: any, obj: any, collectionName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const { event, data } = result;
        const { id } = obj;
        const collection = collectionName;

        event === 'Add' && this.firebaseCollectionService.addDocument('CompanyList', data, collection);
        event === 'Edit' && this.firebaseCollectionService.updateDocument('CompanyList', id, data, collection);
        event === 'Delete' && this.firebaseCollectionService.deleteDocument('CompanyList', id, collection);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }


  fetchData(collection: string, targetList: any, dataSource?: MatTableDataSource<any>) {
    return this.firebaseCollectionService.getDocuments('CompanyList', collection)
      .then((data) => {
        targetList.length = 0;
        if (data && data.length > 0) {
          targetList.push(...data);

          if (dataSource) {
            dataSource.data = [];
            dataSource.data = [...targetList];

            dataSource._updateChangeSubscription();

            setTimeout(() => {
              if (this.table) {
                this.table.renderRows();
              }
            }, 100);
          }
        }
      })
      .catch(error => console.error(`Error fetching ${collection}:`, error));
  }
}
