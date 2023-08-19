import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private _collections = new BehaviorSubject<any[]>([
    {
      name: 'Books at home',
      id: '12345',
      attributes: ['Book Name', 'Author', 'Year', 'Price'],
      items: [
        {
          'Book Name': 'Levitas',
          Author: 'Leviticus',
          Year: '1885',
          Price: '25',
          id: Math.random(),
        },

        {
          'Book Name': 'Levitas II',
          Author: 'Leviticus',
          Year: '1886',
          Price: '35',
          id: Math.random(),
        },
      ],
    },
    {
      name: 'Books at Summer Home',
      id: '123456',
      attributes: ['Book Name', 'Author', 'Year', 'Price'],
      items: [
        {
          'Book Name': 'Levitas III',
          Author: 'Leviticus',
          Year: '1887',
          Price: '25',
          id: Math.random(),
        },
        {
          'Book Name': 'Levitas IV',
          Author: 'Leviticus',
          Year: '1888',
          Price: '35',
          id: Math.random(),
        },
        {
          'Book Name': 'Levitas V',
          Author: 'Leviticus',
          Year: '1889',
          Price: '35',
          id: Math.random(),
        },
        {
          'Book Name': 'Levitas VI',
          Author: 'Leviticus',
          Year: '1900',
          Price: '35',
          id: Math.random(),
        },
      ],
    },
  ]);

  get collections() {
    return this._collections.pipe(delay(300));
  }

  getCollection(id: string) {
    return this.collections.pipe(
      take(1),
      delay(300),
      map((collections) => {
        return <any>{
          ...collections.find((col) => {
            return col.id === id;
          }),
        };
      })
    );
  }

  deleteCollectionItem(collectionId: string, itemId: string) {
    return this.collections.pipe(
      take(1),
      delay(300),
      tap((collections) => {
        const selectedCollectionIndex = collections.findIndex(
          (collection) => collection.id === collectionId
        );
        if (selectedCollectionIndex < 0) {
          return;
        }
        const updatedCollectionItems = [
          ...collections[selectedCollectionIndex].items.filter(
            (item: any) => item.id !== itemId
          ),
        ];
        const updatedCollection = <any>{
          ...collections[selectedCollectionIndex],
          items: [...updatedCollectionItems],
        };
        let updatedCollections = [...collections];
        updatedCollections[selectedCollectionIndex] = updatedCollection;
        this._collections.next(updatedCollections);
      })
    );
  }

  deleteCollection(collectionId: string) {
    return this.collections.pipe(
      take(1),
      delay(300),
      tap((collections) => {
        const updatedcollections = <any[]>[
          ...collections.filter((collection) => collection.id !== collectionId),
        ];
        this._collections.next(updatedcollections);
      })
    );
  }

  constructor() {}
}
