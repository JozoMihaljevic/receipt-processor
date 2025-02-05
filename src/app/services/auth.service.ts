import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  private devModeEnabled = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    // Monitor auth state changes
    this.afAuth.authState.subscribe(user => {
      this.userSubject.next(user);
    });
  }

  // Google Sign-In
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      await this.afAuth.signInWithPopup(provider);
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  // Skip Login (Development Mode)
  enableDevMode(): void {
    this.devModeEnabled = true;
    this.userSubject.next({ uid: 'dev-user', email: 'dev@example.com' });
    this.router.navigate(['/dashboard']);
  }

  // Logout
  async logout(): Promise<void> {
    if (this.devModeEnabled) {
      this.devModeEnabled = false;
      this.userSubject.next(null);
    } else {
      await this.afAuth.signOut();
    }
    await this.router.navigate(['/login']);
  }

  // Get current user
  getCurrentUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return new Observable(subscriber => {
      this.getCurrentUser().subscribe(user => {
        subscriber.next(!!user || this.devModeEnabled);
      });
    });
  }
}
