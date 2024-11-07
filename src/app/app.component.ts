import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'receipt-processor';
    currentYear: number = new Date().getFullYear();
    isLoggedIn = false;

    constructor(private authService: AuthService,
                private router: Router) {
    }

    ngOnInit() {
        console.log('app component')
        this.authService.isLoggedIn().subscribe(user => {
            this.isLoggedIn = !!user;
        });
    }

    logout() {
        this.authService.logout().then(() => {
            this.router.navigate(['/login']);
        });
    }
}
