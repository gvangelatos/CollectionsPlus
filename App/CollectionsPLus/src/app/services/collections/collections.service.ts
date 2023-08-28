import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private restUrl: string =
    'https://collectionsplus-3fd10-default-rtdb.europe-west1.firebasedatabase.app/';
  private _collections = new BehaviorSubject<any[]>([]);
  // private _collections = new BehaviorSubject<any[]>([
  //   {
  //     name: 'Books at home',
  //     id: '12345',
  //     attributes: ['Book Name', 'Author', 'Year', 'Price'],
  //     numberOfItems: '2',
  //     items: [
  //       {
  //         'Book Name': 'Levitas',
  //         Author: 'Leviticus',
  //         Year: '1885',
  //         Price: '25',
  //         id: Math.random(),
  //       },
  //       {
  //         'Book Name': 'Levitas II',
  //         Author: 'Leviticus',
  //         Year: '1886',
  //         Price: '35',
  //         id: Math.random(),
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Books at Summer Home',
  //     id: '123456',
  //     numberOfItems: '4',
  //     attributes: ['Book Name', 'Author', 'Year', 'Price'],
  //     items: [
  //       {
  //         'Book Name': 'Levitas III',
  //         Author: 'Leviticus',
  //         Year: '1887',
  //         Price: '25',
  //         id: Math.random(),
  //       },
  //       {
  //         'Book Name': 'Levitas IV',
  //         Author: 'Leviticus',
  //         Year: '1888',
  //         Price: '35',
  //         id: Math.random(),
  //       },
  //       {
  //         'Book Name': 'Levitas V',
  //         Author: 'Leviticus',
  //         Year: '1889',
  //         Price: '35',
  //         id: Math.random(),
  //       },
  //       {
  //         'Book Name': 'Levitas VI',
  //         Author: 'Leviticus',
  //         Year: '1900',
  //         Price: '35',
  //         id: Math.random(),
  //       },
  //     ],
  //   },
  // ]);

  get collections() {
    return this._collections;
  }

  fetchCollections() {
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          // return of(null);
          throw new Error('User not found!');
        }
        return this.http.get<{ [key: string]: {} }>(
          this.restUrl +
            `/collections.json?orderBy="userId"&equalTo="${userId}"`
        );
      }),
      map((resData) => {
        const incomingCollections = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            incomingCollections.push({
              id: key,
              ...resData[key],
            });
          }
        }
        return incomingCollections;
      }),
      tap((refactoredCollections) => {
        this._collections.next(refactoredCollections);
      })
    );
  }

  getCollection(id: string) {
    return this.http
      .get<{ [key: string]: {} }>(this.restUrl + `/collections/${id}.json`)
      .pipe(
        take(1),
        map((resData) => {
          const incomingCollection: any = { ...resData, id };
          return incomingCollection;
        })
      );
  }

  deleteCollectionItem(collectionId: string, itemId: string) {
    let updatedCollections: any[] = [];
    return this.collections.pipe(
      take(1),
      switchMap((collections) => {
        if (!collections || collections.length <= 0) {
          return this.fetchCollections();
        } else {
          return of(collections);
        }
      }),
      switchMap((collections) => {
        const selectedCollectionIndex = collections.findIndex(
          (collection) => collection.id === collectionId
        );
        const updatedCollectionItems = [
          ...collections[selectedCollectionIndex].items.filter(
            (item: any) => item.id !== itemId
          ),
        ];
        const updatedCollection = <any>{
          ...collections[selectedCollectionIndex],
          items: [...updatedCollectionItems],
          numberOfItems: (
            +collections[selectedCollectionIndex].numberOfItems - 1
          ).toString(),
        };
        updatedCollections = [...collections];
        updatedCollections[selectedCollectionIndex] = updatedCollection;
        return this.http.put(
          this.restUrl + `/collections/${collectionId}.json`,
          { ...updatedCollection, id: null }
        );
      }),
      tap(() => {
        this._collections.next(updatedCollections);
      })
    );
  }

  deleteCollection(collectionId: string) {
    return this.http
      .delete(this.restUrl + `/collections/${collectionId}.json`)
      .pipe(
        switchMap(() => {
          return this.collections;
        }),
        take(1),
        tap((collections) => {
          const updatedcollections = <any[]>[
            ...collections.filter(
              (collection) => collection.id !== collectionId
            ),
          ];
          this._collections.next(updatedcollections);
        })
      );
  }

  addItemToCollection(collectionId: string, item: any) {
    let updatedCollections: any[] = [];
    return this.collections.pipe(
      take(1),
      switchMap((collections) => {
        if (!collections || collections.length <= 0) {
          return this.fetchCollections();
        } else {
          return of(collections);
        }
      }),
      switchMap((collections) => {
        const selectedCollectionIndex = collections.findIndex(
          (collection) => collection.id === collectionId
        );
        if (!collections[selectedCollectionIndex].items) {
          collections[selectedCollectionIndex].items = [];
        }
        const updatedCollectionItems = [
          ...collections[selectedCollectionIndex].items,
          item,
        ];
        const updatedCollection = <any>{
          ...collections[selectedCollectionIndex],
          items: [...updatedCollectionItems],
          numberOfItems: (
            +collections[selectedCollectionIndex].numberOfItems + 1
          ).toString(),
        };
        updatedCollections = [...collections];
        updatedCollections[selectedCollectionIndex] = updatedCollection;
        return this.http.put(
          this.restUrl + `/collections/${collectionId}.json`,
          { ...updatedCollection, id: null }
        );
      }),
      tap(() => {
        this._collections.next(updatedCollections);
      })
    );
  }

  addCollection(collection: any) {
    let generatedId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          // return of(null);
          throw new Error('User not found!');
        }
        return this.http.post<{ name: string }>(
          this.restUrl + '/collections.json',
          {
            ...collection,
            userId: userId,
          }
        );
      }),
      switchMap((resdata) => {
        generatedId = resdata?.name;
        return this.collections;
      }),
      take(1),
      tap((collections) => {
        let updatedCollections = [
          ...collections,
          { ...collection, id: generatedId },
        ];
        this._collections.next(updatedCollections);
      })
    );
  }

  constructor(private http: HttpClient, private authService: AuthService) {}
}
