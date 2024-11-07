import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { firebaseConfig } from '../../firebaseConfig';
import { Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {Router, ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from "@angular/router/testing";
import {routes} from "./app.routes";

// Mock AngularFireAuth
const mockAngularFireAuth = {
    authState: of(null), // Mock authState observable
    signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve()), // Mock signOut method
};

// Mock Router
const mockRouter = {
    navigate: jasmine.createSpy('navigate'), // Mock navigate method
};

// Mock ActivatedRoute
const mockActivatedRoute = {
    snapshot: { paramMap: { get: () => '123' } }, // Mock snapshot to return parameters if needed
};

// Mock Firestore
const mockFirestore: any = {};

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let afAuth: AngularFireAuth;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent, RouterTestingModule.withRoutes(routes)],
            providers: [
                { provide: AngularFireAuth, useValue: mockAngularFireAuth },
                { provide: Firestore, useValue: mockFirestore },
                { provide: Router, useValue: mockRouter }, // Provide the mock router
                { provide: ActivatedRoute, useValue: mockActivatedRoute }, // Provide the mock ActivatedRoute
                importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
                provideFirestore(() => getFirestore()),
                provideFirebaseApp(() => initializeApp(firebaseConfig)),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        afAuth = TestBed.inject(AngularFireAuth);
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it(`should have the 'kupovina' title`, () => {
        expect(component.title).toEqual('kupovina');
    });
});
