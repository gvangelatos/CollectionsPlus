import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  Config,
  IonModal,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Subscription, take } from 'rxjs';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  form!: FormGroup;
  fields: any[] = [];
  private _subscriptions: Subscription[] = [];
  @ViewChild(IonModal) modal!: IonModal;

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
              this.buildForm();
              loadingEl.dismiss();
            });
        });
    });
  }

  buildForm() {
    const formGroupFields = this.getFormControlsFields();
    this.form = new FormGroup(formGroupFields);
  }

  getFormControlsFields() {
    const formGroupFields: any = {};
    for (const field of this.collection?.attributes) {
      formGroupFields[field] = new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      });
      this.fields.push(field);
    }
    return formGroupFields;
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
                            return;
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

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    console.log(this.form.value);
    const newItem = { ...this.form.value, id: Math.random().toString() };
    this.loadingCtrl
      .create({
        message: 'Adding Item to your collection...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.collectionsService
          .addItemToCollection(this.collectionId, newItem)
          .subscribe((res) => {
            if (res) {
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
                    return;
                  }
                  this.collection = { ...collection };
                  this.toastCtrl
                    .create({
                      message: 'Item added Successfully!',
                      duration: 1500,
                      position: 'bottom',
                      icon: 'checkmark-circle-outline',
                      color: 'success',
                    })
                    .then((toastEl) => {
                      toastEl.present();
                      this.modal.dismiss(null, 'confirm');
                      loadingEl.dismiss();
                      this.form.reset();
                    });
                });
            } else {
              this.toastCtrl
                .create({
                  message: 'Cold not add item!',
                  duration: 1500,
                  position: 'bottom',
                  icon: 'close-circle-outline',
                  color: 'danger',
                })
                .then((toastEl) => {
                  toastEl.present();
                });
            }
          });
      });
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
