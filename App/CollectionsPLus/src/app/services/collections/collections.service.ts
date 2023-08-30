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

  get collections() {
    return this._collections;
  }

  fetchCollections() {
    let fetchedToken = '';
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = <string>token;
        return this.authService.userId;
      }),
      take(1),
      switchMap((userId) => {
        if (!userId) {
          // return of(null);
          throw new Error('User not found!');
        }
        return this.http.get<{ [key: string]: {} }>(
          this.restUrl +
            `/collections.json?auth=${fetchedToken}&orderBy="userId"&equalTo="${userId}"`
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
    let fetchedToken = '';
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = <string>token;
        return this.http.get<{ [key: string]: {} }>(
          this.restUrl + `/collections/${id}.json?auth=${fetchedToken}`
        );
      }),
      take(1),
      map((resData) => {
        const incomingCollection: any = { ...resData, id };
        return incomingCollection;
      })
    );
  }

  deleteCollectionItem(collectionId: string, itemId: string) {
    let updatedCollections: any[] = [];
    let fetchedToken = '';
    let fetchedId = '';
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = <string>token;
        return this.authService.userId;
      }),
      take(1),
      switchMap((userId) => {
        fetchedId = <string>userId;
        return this.collections;
      }),
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
          this.restUrl +
            `/collections/${collectionId}.json?auth=${fetchedToken}`,
          { ...updatedCollection, id: null, userId: fetchedId }
        );
      }),
      tap(() => {
        this._collections.next(updatedCollections);
      })
    );
  }

  deleteCollection(collectionId: string) {
    let fetchedToken = '';
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = <string>token;
        return this.http.delete(
          this.restUrl +
            `/collections/${collectionId}.json?auth=${fetchedToken}`
        );
      }),
      switchMap(() => {
        return this.collections;
      }),
      take(1),
      tap((collections) => {
        const updatedcollections = <any[]>[
          ...collections.filter((collection) => collection.id !== collectionId),
        ];
        this._collections.next(updatedcollections);
      })
    );
  }

  addItemToCollection(collectionId: string, item: any) {
    let updatedCollections: any[] = [];
    let fetchedToken = '';
    let fetchedId = '';
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = <string>token;
        return this.authService.userId;
      }),
      take(1),
      switchMap((userId) => {
        fetchedId = <string>userId;
        return this.collections;
      }),
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
          this.restUrl +
            `/collections/${collectionId}.json?auth=${fetchedToken}`,
          { ...updatedCollection, id: null, userId: fetchedId }
        );
      }),
      tap(() => {
        this._collections.next(updatedCollections);
      })
    );
  }

  addCollection(collection: any) {
    let generatedId: string;
    let fetchedToken = '';
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = <string>token;
        return this.authService.userId;
      }),
      take(1),
      switchMap((userId) => {
        if (!userId) {
          // return of(null);
          throw new Error('User not found!');
        }
        return this.http.post<{ name: string }>(
          this.restUrl + `/collections.json?auth=${fetchedToken}`,
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
