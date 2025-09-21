import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  logged_in: Boolean = false;
  language: String = 'English';
  user_role: String;

  constructor(private translate: TranslateService, private router: Router, private cart: CartService) { }


  ngOnInit() {}

  ngDoCheck() {
    this.user_role = sessionStorage.getItem("role");
    const user_session_id = sessionStorage.getItem("user_session_id")
    this.logged_in = !!user_session_id;
  }

  get cartCount(): number {
    return this.cart.count();
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    if (language == 'en') {
      this.language = "English";
    } else if (language == 'hn') {
      this.language = "हिंदी(Hindi)";
    }
  }

  logOut() {
    sessionStorage.removeItem("user_session_id");
    sessionStorage.removeItem("role");
    this.router.navigateByUrl('/');
  }

}
