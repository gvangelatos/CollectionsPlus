import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  Config,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Subscription, take } from 'rxjs';
import { CollectionsService } from 'src/app/services/collections/collections.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit, OnDestroy {
  collection: any;
  mode: string = 'ios';
  searchingCollection: boolean = false;
  searchQuery: string = '';
  collectionId: string = '';
  collectionItemsFilteredSearch: any[] = [];
  private _subscriptions: Subscription[] = [];

  constructor(
    private config: Config,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private collectionsService: CollectionsService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.mode = this.config.get('mode');
    this.activatedRoute?.paramMap?.subscribe((paramMap) => {
      if (!paramMap?.has('collectionId')) {
        this.navCtrl.navigateBack('/collections');
        return;
      }
      this.collectionId = <string>paramMap?.get('collectionId');
      this.loadingCtrl
        .create({ message: 'Loading Collection...' })
        .then((loadingEl) => {
          loadingEl.present();
          this.collectionsService
            .getCollection(this.collectionId)
            .pipe(take(1))
            .subscribe((collection) => {
              if (!collection || !collection.id) {
                loadingEl.dismiss();
                this.alertCtrl
                  .create({
                    header: 'Oops...!',
                    subHeader: 'It seems you encountered a problem!',
                    message: "We couldn't load your collection!",
                    buttons: [
                      {
                        text: 'Back to Safety',
                        role: 'confirm',
                        handler: () => {
                          this.navCtrl.navigateBack('/collections');
                        },
                      },
                    ],
                  })
                  .then((alertEl) => {
                    alertEl.present();
                  });
              }
              this.collection = { ...collection };
              loadingEl.dismiss();
            });
        });
    });
  }

  handleSearchInput(event: any) {
    this.searchingCollection = true;
    this.searchQuery = event.target.value.toLowerCase().trim();
    this.collectionItemsFilteredSearch = [
      ...this.collection?.items.filter((item: any) => {
        let fullText = '';
        for (const [key, value] of Object.entries(item)) {
          fullText += ' ' + value;
        }
        return fullText.toLowerCase().indexOf(this.searchQuery) > -1;
      }),
    ];
    this.searchingCollection = false;
  }

  onAddClicked() {}

  onDelete(itemId: string) {
    this.actionSheetCtrl
      .create({
        header: 'Are you sure you want to delete this item?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Item...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  // this.loadingOutfits = true;
                  this.collection = null;
                  this.collectionsService
                    .deleteCollectionItem(this.collectionId, itemId)
                    .subscribe((res) => {
                      loadingEl.dismiss();
                      this.collectionsService
                        .getCollection(this.collectionId)
                        .pipe(take(1))
                        .subscribe((collection) => {
                          if (!collection || !collection.id) {
                            loadingEl.dismiss();
                            this.alertCtrl
                              .create({
                                header: 'Oops...!',
                                subHeader:
                                  'It seems you encountered a problem!',
                                message: "We couldn't load your collection!",
                                buttons: [
                                  {
                                    text: 'Back to Safety',
                                    role: 'confirm',
                                    handler: () => {
                                      this.navCtrl.navigateBack('/collections');
                                    },
                                  },
                                ],
                              })
                              .then((alertEl) => {
                                alertEl.present();
                              });
                          }
                          this.collection = { ...collection };
                          loadingEl.dismiss();
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
