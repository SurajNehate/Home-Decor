import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogService, CatalogProduct } from '../shared/services/catalog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: CatalogProduct[] = [];
  categories: string[] = [];
  featured: CatalogProduct[] = [];

  constructor(private router: Router, private catalog: CatalogService) { }

  ngOnInit() {
    this.catalog.getAll().subscribe(list => {
      this.products = list;
      this.categories = Array.from(new Set(list.map(p => p.category)));
      this.featured = list.slice(0, 4);
    });
  }

  goToCategory(cat: string) {
    this.router.navigate(['/catalog'], { queryParams: { category: cat } });
  }

  viewProduct(id: number) {
    this.router.navigate(['/catalog', id]);
  }
}
