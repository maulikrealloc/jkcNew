import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { OnlineStatusService } from './services/online-status.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isOnline :boolean = false
  constructor(public translate: TranslateService,private router: Router,private onlineStatusService :OnlineStatusService) {
    translate.addLangs(['en', 'fr','es','de']);
    translate.setDefaultLang('en');   

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
        if (!localStorage.getItem('uid') && event.url.split('/')[1] != 'authentication') {
          this.router.navigate(['/authentication/side-login'])
        }
    });

    this.onlineStatusService.onlineStatus$.subscribe(status => {
      this.isOnline = status;
    });
 }
}
