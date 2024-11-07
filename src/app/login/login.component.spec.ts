import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { of } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import {importProvidersFrom} from "@angular/core";
import {AngularFireModule} from "@angular/fire/compat";
import {firebaseConfig} from "../../../firebaseConfig";

// Mock Firebase configuration
// const firebaseConfig = {
//     apiKey: 'test-api-key',
//     authDomain: 'test-auth-domain',
//     projectId: 'test-project-id',
//     storageBucket: 'test-storage-bucket',
//     messagingSenderId: 'test-messaging-sender-id',
//     appId: 'test-app-id',
// };

// Mock AngularFireAuth
const mockAngularFireAuth: any = {
    authState: of(null), // Mock the authState observable
    signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword'),
    setPersistence: jasmine.createSpy('setPersistence'),
    signOut: jasmine.createSpy('signOut'),
};

// Mock Router
const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
};

// Firestore mock
const mockFirestore: any = {};



describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let afAuth: AngularFireAuth;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                LoginComponent, // Directly import the standalone component

            ],
            providers: [
                importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
                provideFirestore(() => getFirestore()),
                provideFirebaseApp(() => initializeApp(firebaseConfig)),
                { provide: AngularFireAuth, useValue: mockAngularFireAuth },
                { provide: Router, useValue: mockRouter },
                { provide: Firestore, useValue: mockFirestore },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        afAuth = TestBed.inject(AngularFireAuth);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call signInWithEmailAndPassword on login', waitForAsync(async () => {
        // Arrange
        const mockUserCredential = { user: { email: 'test@example.com' } };
        mockAngularFireAuth.signInWithEmailAndPassword.and.returnValue(Promise.resolve(mockUserCredential));
        mockAngularFireAuth.setPersistence.and.returnValue(Promise.resolve());

        component.email = 'test@example.com';
        component.password = 'password123';

        // Act
        await component.login();

        // Assert
        expect(afAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
    }));
});
