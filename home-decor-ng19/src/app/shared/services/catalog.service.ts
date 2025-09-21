import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CatalogProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly productsUrl = 'assets/products.json';
  private products$ = new BehaviorSubject<CatalogProduct[]>([]);
  private loaded = false;

  constructor(private http: HttpClient) {}

  load(): Observable<CatalogProduct[]> {
    if (!this.loaded) {
      this.http.get<CatalogProduct[]>(this.productsUrl).subscribe(list => {
        this.products$.next(list || []);
        this.loaded = true;
      });
    }
    return this.products$.asObservable();
  }

  all(): Observable<CatalogProduct[]> { return this.load(); }
  byId(id: number): Observable<CatalogProduct | undefined> { return this.all().pipe(map(l => l.find(p => p.id === id))); }

  add(product: { name: string; price: number; imageUrl: string; category: string; description: string }): void {
    const list = [...this.products$.value];
    const newId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
    list.push({ id: newId, ...product });
    this.products$.next(list);
  }

  update(product: CatalogProduct): void {
    const list = [...this.products$.value];
    const idx = list.findIndex(p => p.id === product.id);
    if (idx >= 0) { list[idx] = { ...product }; this.products$.next(list); }
  }

  remove(id: number): void {
    this.products$.next(this.products$.value.filter(p => p.id !== id));
  }

  downloadJson(filename = 'products.json'): void {
    const data = JSON.stringify(this.products$.value, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  importFromJson(jsonText: string): void {
    try {
      const parsed = JSON.parse(jsonText) as CatalogProduct[];
      if (Array.isArray(parsed)) this.products$.next(parsed);
    } catch (e) { console.error('Invalid products JSON', e); }
  }
}