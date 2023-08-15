import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CollectionsService } from 'src/app/services/collections/collections.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit, OnDestroy {
  collections: any[] = [];
  private _subscriptions: Subscription[] = [];

  constructor(private collectionsService: CollectionsService) {}

  ngOnInit() {
    this._subscriptions.push(
      this.collectionsService.collections.subscribe((collections) => {
        this.collections = collections;
        // console.log('all');
        console.log(this.collections);
      })
    );
  }

  onAddClicked() {}

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
