import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import { Photo } from '../../../models/photo.model';
import { environment } from '../../../../environments/environment';
import { SettingsState } from '../../state/settings.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DeleteUserPhoto, AddUserPhoto, SetMainPhoto } from '../../state/settings.actions';

@Component({
  selector: 'app-settings-photos',
  templateUrl: './settings-photos.component.html',
  styleUrls: ['./settings-photos.component.scss'],
})
export class SettingsPhotosComponent implements OnInit {
  photos: Photo[];

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiURL + 'photos/';

  @Select(SettingsState.getUserPhotos) photos$: Observable<Photo[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    const currentUser = JSON.parse(localStorage.getItem('auth.currentUser'));
    this.uploader = new FileUploader({
      url: this.baseUrl,
      authToken: 'Bearer ' + currentUser.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        // console.log(response);
        const photo = Object.assign({}, res) as Photo;
        // console.log('photo:', photo);
        this.store.dispatch(new AddUserPhoto(photo));
        // this.store.updatePhotos(photo);
        // if (photo.isMain) {
        //   this.auth.changeMemberPhoto(photo.url);
        //   this.auth.currentUser.photoUrl = photo.url;
        //   localStorage.setItem('user', JSON.stringify(this.auth.currentUser));
        // }
      }
    };
  }

  setMainPhoto(photo) {
    this.store.dispatch(new SetMainPhoto(photo.id));
  }

  deletePhoto(photo: Photo) {
    console.log('photo:', photo);
    this.store.dispatch(new DeleteUserPhoto(photo.id));
  }
}
