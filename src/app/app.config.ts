import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { routes } from './app.routes';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import {firebaseConfig} from "../../firebaseConfig";
import {AngularFireModule} from "@angular/fire/compat";
import {HttpClientModule} from "@angular/common/http";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth(() => getAuth()),  // ✅ Provide Firebase Auth
    provideFirestore(() => getFirestore()),  // ✅ Provide Firestore
    provideAnimations(),
    importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase())
  ]
};

