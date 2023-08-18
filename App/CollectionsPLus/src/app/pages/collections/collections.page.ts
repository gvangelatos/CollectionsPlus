import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CollectionsService } from 'src/app/services/collections/collections.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit, OnDestroy {
  collections: any[] = [];
  loadingCollections: boolean = true;
  private _subscriptions: Subscription[] = [];

  constructor(
    private collectionsService: CollectionsService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this._subscriptions.push(
      this.collectionsService.collections.subscribe((collections) => {
        this.collections = collections;
        this.loadingCollections = false;
        // console.log('all');
        console.log(this.collections);
      })
    );
  }

  onAddClicked() {}

  onDeleteCollection(collectionId: string) {
    this.actionSheetCtrl
      .create({
        header:
          'Are you sure you want to delete this Collection? Everything in it will be deleted',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Item...' })
                .then((loadingEl) => {
                  this.loadingCollections = true;

                  loadingEl.present();
                  // this.loadingOutfits = true;
                  this.collections = [];
                  this.collectionsService
                    .deleteCollection(collectionId)
                    .subscribe((res) => {
                      loadingEl.dismiss();
                      // this.loadingCollections = false;

                      this.toastCtrl
                        .create({
                          message: 'Removed Successfully!',
                          duration: 1500,
                          position: 'bottom',
                          icon: 'checkmark-circle-outline',
                          color: 'success',
                        })
                        .then((toastEl) => {
                          toastEl.present();
                        });
                    });
                });
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
