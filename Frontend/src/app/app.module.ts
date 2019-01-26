import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

import { HttpCacheService } from './interceptors/http-cache.service';
import { CacheInterceptor } from './interceptors/cache.interceptor';

import { AppComponent } from './core/containers/app/app.component';
import { AppRoutingModule } from './app-routing.module';

import { TokenInterceptor } from './interceptors/token.interceptor';
import { States } from './core/state/app.state';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxsModule.forRoot(States, { developmentMode: !environment.production }),
    NgxsFormPluginModule.forRoot(),
    // NgxsLoggerPluginModule.forRoot({ logger: console, collapsed: false }),
    NgxsStoragePluginModule.forRoot({
      key: [
        'auth.currentUser',
      ],
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    CoreModule.forRoot(),
  ],
  providers: [
    HttpCacheService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule {}
