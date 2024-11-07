import { Routes } from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {TrackerComponent} from "./tracker/tracker.component";

export const routes: Routes = [
    { path: '', redirectTo: 'tracker', pathMatch: 'full' },
    { path: 'tracker', component: TrackerComponent, canActivate: [AuthGuard] },
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent }
];
