import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { ComponentRestrictions } from 'ngx-google-places-autocomplete/objects/options/componentRestrictions';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Store } from '@ngxs/store';

import { CreateEvent } from '../../state/event.actions';
import { Router } from '@angular/router';

declare var google: any;

interface Location {
  lat?: number;
  lng?: number;
  viewport?: Object;
  zoom?: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  countryShort?: string;
}

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent implements OnInit {
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('venueRef') venueRef: GooglePlaceDirective;

  location: Location = {};
  eventTime: Date = new Date();

  eventForm: FormGroup;
  bsValue;
  bsConfig: Partial<BsDatepickerConfig>;

  optionsCity: Partial<Options> = {
    types: ['(cities)'],
  };

  optionsVenue: Partial<Options> = {
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(-33.8902, 151.1759),
      new google.maps.LatLng(-33.8474, 151.2631),
    ),
    types: ['establishment'],
  };

  constructor(private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private store: Store, private router: Router) {}

  ngOnInit() {
    this.createEventForm();
  }

  createEventForm() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['Drinks', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required]],
      venue: ['', [Validators.required]],
      venueLat: [0],
      venueLng: [0],
      date: ['', Validators.required],
      time: [new Date(2019, 5, 24, 18, 30)]
    });
  }

  onSubmit() {
    const date = new Date(this.eventForm.controls['date'].value);
    const time = new Date(this.eventForm.controls['time'].value);
    const newDate = new Date(date.setHours(time.getHours(), time.getMinutes()));
    this.eventForm.patchValue({date: newDate});
    // console.log('date', date);
    // console.log('time', time);
    // console.log('newDate', newDate);
    const formValues = this.eventForm.value;
    console.log('Form values', formValues);
    this.store.dispatch(new CreateEvent(formValues)).subscribe(res => {
      this.router.navigate(['/events']);
    });
  }

  handleAddressChange(address: Address) {
    console.log(address.formatted_address);
    // this.location.lat = address.geometry.location.lat();
    // this.location.lng = address.geometry.location.lng();
    this.eventForm.patchValue({ city: address.formatted_address });
    this.decomposeAddressComponents(address);
    const extend = address.geometry.viewport.toJSON();
    this.venueRef.options.componentRestrictions = new ComponentRestrictions({
      country: this.location.countryShort,
    });
    this.optionsVenue.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(extend.south.toFixed(4), extend.west.toFixed(4)),
      new google.maps.LatLng(extend.north.toFixed(4), extend.east.toFixed(4)),
    );
    this.changeDetectorRef.detectChanges();
    this.venueRef.reset();
  }

  handleVenueChange(address: Address) {
    console.log(address.adr_address.toString());
    this.eventForm.patchValue({ venue: address.name + ', ' + address.formatted_address });
    console.log(address.geometry.location.lat(), address.geometry.location.lng());
    this.location.lat = address.geometry.location.lat();
    this.location.lng = address.geometry.location.lng();
    this.eventForm.patchValue({
      venueLat: address.geometry.location.lat(),
      venueLng: address.geometry.location.lng(),
    });
    this.changeDetectorRef.detectChanges();
  }

  decomposeAddressComponents(result) {
    if (result.length === 0) {
      return false;
    }
    const address = result.address_components;

    for (const element of address) {
      if (element.length === 0 && !element['types']) {
        continue;
      }

      if (element['types'].indexOf('street_number') > -1) {
        this.location.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        this.location.address_level_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        this.location.address_level_2 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        this.location.address_state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        this.location.address_country = element['long_name'];
        this.location.countryShort = element['short_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        this.location.address_zip = element['long_name'];
        continue;
      }
    }
    console.log('Decomposed Address---', this.location);
  }
}
