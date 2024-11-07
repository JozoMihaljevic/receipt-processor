import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import {AuthService} from "./services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private afAuth: AngularFireAuth, private router: Router, private authService: AuthService) {}

    canActivate(): Observable<boolean> {
        return this.authService.isLoggedIn().pipe(
            map((user) => {
                if (user) {
                    return true;
                } else {
                    this.router.navigate(['/login']);
                    return false;
                }
            })
        );
    }
}