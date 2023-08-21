import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActionSheetController,
  IonModal,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit, OnDestroy {
  collections: any[] = [];
  loadingCollections: boolean = false;
  form!: FormGroup;
  attributes: any[] = [{ name: '' }];
  disableActions: boolean = false;
  @ViewChild(IonModal) modal!: IonModal;
  private _subscriptions: Subscription[] = [];

  constructor(
    private collectionsService: CollectionsService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      collectionName: this.formBuilder.array([
        this.formBuilder.group({
          name: [
            null,
            {
              updateOn: 'change',
              validators: [Validators.required],
            },
          ],
        }),
      ]),
      attributes: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this._subscriptions.push(
      this.collectionsService.collections.subscribe((collections) => {
        this.collections = collections;
      })
    );
    this.attributes.forEach((attribute) =>
      this.attributesControl.push(
        this.formBuilder.group({
          name: [
            attribute.name,
            {
              updateOn: 'change',
              validators: [Validators.required],
            },
          ],
        })
      )
    );
  }

  get attributesControl(): FormArray {
    return this.form.get('attributes') as FormArray;
  }

  get collectionNameControl(): FormArray {
    return this.form.get('collectionName') as FormArray;
  }

  ionViewWillEnter() {
    this.loadingCollections = true;
    this.collectionsService.fetchCollections().subscribe(() => {
      this.loadingCollections = false;
    });
  }

  onAddClicked() {}

  onDeleteCollection(collectionId: string) {
    this.disableActions = true;
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
                          this.loadingCollections = false;
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

        this.disableActions = false;
      });
  }

  add() {
    this.attributesControl.push(
      this.formBuilder.group({
        name: [
          null,
          {
            updateOn: 'change',
            validators: [Validators.required],
          },
        ],
      })
    );
  }

  remove(index: any) {
    this.attributesControl.removeAt(index);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    const newCollectionAttributes: any[] = [];
    this.form.value.attributes.forEach((attributeObj: any) => {
      newCollectionAttributes.push(attributeObj.name);
    });
    const newCollection = {
      name: this.form.value.collectionName[0].name,
      attributes: newCollectionAttributes,
      items: [],
      numberOfItems: 0,
    };
    this.loadingCtrl
      .create({
        message: 'Creating your new collection...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.collectionsService
          .addCollection(newCollection)
          .subscribe((res) => {
            if (res) {
              this.toastCtrl
                .create({
                  message: 'Collection Created Successfully!',
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
                  this.form = this.formBuilder.group({
                    collectionName: this.formBuilder.array([
                      this.formBuilder.group({
                        name: [
                          null,
                          {
                            updateOn: 'change',
                            validators: [Validators.required],
                          },
                        ],
                      }),
                    ]),
                    attributes: this.formBuilder.array([]),
                  });
                  this.attributes = [{ name: '' }];
                  this.attributes.forEach((attribute) =>
                    this.attributesControl.push(
                      this.formBuilder.group({
                        name: [
                          attribute.name,
                          {
                            updateOn: 'change',
                            validators: [Validators.required],
                          },
                        ],
                      })
                    )
                  );
                });
            } else {
              loadingEl.dismiss();
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
