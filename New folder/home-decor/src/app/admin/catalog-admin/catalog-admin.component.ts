import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogService, CatalogProduct } from '../../shared/services/catalog.service';

@Component({
  selector: 'app-catalog-admin',
  templateUrl: './catalog-admin.component.html',
  styleUrls: ['./catalog-admin.component.scss']
})
export class CatalogAdminComponent implements OnInit {
  products: CatalogProduct[] = [];
  editorText = '';
  newProduct: Partial<CatalogProduct> = { name: '', price: 0, category: '', imageUrl: '', description: '' };

  constructor(private catalog: CatalogService, private router: Router) {}

  // Logout functionality moved to main header

  ngOnInit() {
    this.catalog.getAll().subscribe(list => {
      this.products = list;
      this.editorText = JSON.stringify(list, null, 2);
    });
  }

  onSectionChange(val: string) {
    if (val === 'users') { this.router.navigateByUrl('/admin/users'); }
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.category || !this.newProduct.price) return;
    this.catalog.add({
      name: this.newProduct.name!,
      price: Number(this.newProduct.price),
      imageUrl: this.newProduct.imageUrl || '',
      category: this.newProduct.category!,
      description: this.newProduct.description || ''
    });
    this.newProduct = { name: '', price: 0, category: '', imageUrl: '', description: '' };
  }

  deleteProduct(id: number) {
    this.catalog.remove(id);
  }

  downloadJson() {
    this.catalog.downloadJson('products.json');
  }

  applyEditor() {
    this.catalog.importFromJson(this.editorText);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : undefined;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const text = String((e.target as FileReader).result);
      this.editorText = text;
      this.applyEditor();
    };
    reader.readAsText(file);
    input.value = '';
  }
}
