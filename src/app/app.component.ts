import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, filter } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { OnlineStatusService } from './services/online-status.service';
import { SpinnerService } from './services/spinner.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isOnline :boolean = false
  constructor(public translate: TranslateService,private router: Router,private onlineStatusService :OnlineStatusService,
    private spinnerService : SpinnerService , private firestore: AngularFirestore, private snackBar :MatSnackBar) {
    translate.addLangs(['en', 'fr','es','de']);
    translate.setDefaultLang('en');   

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
        if (!localStorage.getItem('uid') && event.url.split('/')[1] != 'authentication') {
          this.router.navigate(['/authentication/side-login'])
        }       
        const uid:any = localStorage.getItem('uid')
        this.firestore.collection('CompanyList').doc(uid).valueChanges().subscribe((data:any) => {
          if (data.isDisabled) {
            this.router.navigate(['/authentication/side-login'])
          }
        });
        
    });

    this.onlineStatusService.onlineStatus$.subscribe(status => {
      this.isOnline = status;
    });
 }


}
