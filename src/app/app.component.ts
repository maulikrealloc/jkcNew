import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { SpinnerService } from './services/spinner.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(public translate: TranslateService,private router: Router,private spinnerService :SpinnerService) {
    translate.addLangs(['en', 'fr','es','de']);
    translate.setDefaultLang('en');   

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
        if (!localStorage.getItem('uid') && event.url.split('/')[1] != 'authentication') {
          this.router.navigate(['/authentication/side-login'])
        }
    });
 }
}
