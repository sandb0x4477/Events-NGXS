import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Store } from '@ngxs/store';
import { BsDatepickerConfig } from 'ngx-bootstrap';

import { UserInfo } from '../../../models/user-info.model';
import { UpdateUserInfo } from '../../state/settings.actions';

interface Location {
  address_country?: string;
}

@Component({
  selector: 'app-settings-basic',
  templateUrl: './settings-basic.component.html',
  styleUrls: ['./settings-basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBasicComponent implements OnInit {
  basicForm: FormGroup;
  userInfo: UserInfo;
  bsValue;
  bsConfig: Partial<BsDatepickerConfig>;

  options = {
    types: ['(cities)'],
    // componentRestrictions: {country: 'fr'}
  };

  public location: Location = {} as Location;

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;

  constructor(private fb: FormBuilder, public store: Store) {}

  ngOnInit() {
    this.createBasicForm();
  }

  createBasicForm() {
    this.basicForm = this.fb.group({
      fullName: '',
      dateOfBirth: '',
      gender: '',
      city: '',
      country: '',
    });
  }

  updateProfile() {
    const formValues = this.basicForm.getRawValue();
    this.userInfo = Object.assign({}, this.basicForm.getRawValue());
    // console.log('before conversion', this.basicInfo);
    this.userInfo.dateOfBirth = this.convertLocalDateToUTCDate(
      formValues.dateOfBirth,
      false,
    )
      .toISOString()
      .slice(0, 10);
    this.userInfo.dateOfBirth += 'T00:00:00.000Z';
    console.log('after conversion', this.userInfo);
    this.store.dispatch(new UpdateUserInfo(this.userInfo));
  }

  convertLocalDateToUTCDate(date, toUTC) {
    date = new Date(date);
    // Local time converted to UTC
    // console.log('Time: ' + date);
    const localOffset = date.getTimezoneOffset() * 60000;
    const localTime = date.getTime();
    if (toUTC) {
      date = localTime + localOffset;
    } else {
      date = localTime - localOffset;
    }
    date = new Date(date);
    // console.log('Converted time: ' + date);
    return date;
  }

  handleAddressChange(event) {
    this.extractAddress(event);
    this.basicForm.patchValue({ city: event.address_components[0].long_name });
    this.basicForm.patchValue({ country: this.location.address_country });
  }

  extractAddress(results) {
    if (results.length === 0) {
      return false;
    }
    const address = results.address_components;

    for (const element of address) {
      if (element.length === 0 && !element['types']) {
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        this.location.address_country = element['long_name'];
        continue;
      }
    }
  }
}
