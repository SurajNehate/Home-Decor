import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogService, CatalogProduct } from '../../shared/services/catalog.service';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product?: CatalogProduct;

  constructor(
    private route: ActivatedRoute,
    private catalog: CatalogService,
    private cart: CartService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalog.getById(id).subscribe(p => (this.product = p));
  }

  addToCart() {
    if (!this.product) return;
    const p = this.product;
    this.cart.add({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl }, 1);
    alert('Added to cart');
  }
}
