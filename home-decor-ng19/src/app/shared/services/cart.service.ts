import { Injectable } from '@angular/core';

export interface CartItem {
  id: number; name: string; price: number; imageUrl: string; qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly key = 'guest_cart_v1';

  private read(): CartItem[] { try { const r = localStorage.getItem(this.key); return r ? JSON.parse(r) : []; } catch { return []; } }
  private write(items: CartItem[]): void { localStorage.setItem(this.key, JSON.stringify(items)); }

  get(): CartItem[] { return this.read(); }
  add(item: { id: number; name: string; price: number; imageUrl: string }, qty = 1): void {
    const items = this.read(); const i = items.findIndex(x => x.id === item.id);
    if (i >= 0) items[i].qty += qty; else items.push({ ...item, qty });
    this.write(items);
  }
  updateQty(id: number, qty: number): void { const items = this.read(); const i = items.findIndex(x => x.id === id); if (i >= 0) { items[i].qty = Math.max(1, qty); this.write(items); } }
  remove(id: number): void { this.write(this.read().filter(x => x.id !== id)); }
  clear(): void { this.write([]); }
  total(): number { return this.read().reduce((s, i) => s + i.price * i.qty, 0); }
  count(): number { return this.read().reduce((s, i) => s + i.qty, 0); }
}