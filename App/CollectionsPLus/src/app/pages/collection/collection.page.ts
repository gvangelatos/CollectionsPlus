import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  Config,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CollectionsService } from 'src/app/services/collections/collections.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit {
  collection: any;
  mode: string = 'ios';
  searchingCollection: boolean = false;
  searchQuery: string = '';
  collectionItemsFilteredSearch: any[] = [];
  private _subscriptions: Subscription[] = [];

  constructor(
    private config: Config,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private collectionsService: CollectionsService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.mode = this.config.get('mode');
    this.activatedRoute?.paramMap?.subscribe((paramMap) => {
      if (!paramMap?.has('collectionId')) {
        this.navCtrl.navigateBack('/collections');
        return;
      }
      this.loadingCtrl
        .create({ message: 'Loading Collection...' })
        .then((loadingEl) => {
          loadingEl.present();
          this._subscriptions.push(
            this.collectionsService
              .getCollection(<string>paramMap?.get('collectionId'))
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
                this.collection = collection;
                loadingEl.dismiss();
              })
          );
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

  onDelete() {}
}
