import { promises as fs } from "node:fs";

const path = "../datos/carts.json";

export class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.nextId = 1;
    this.initializeFile();
  }

  async initializeFile() {
    try {
      await fs.access(this.path);
      console.log("File exists. Loading carts...");
      await this.loadCartsFromFile();
    } catch (err) {
      console.log("File doesn't exist. Creating new carts file...");
      await fs.writeFile(this.path, "[]");
    }
  }

  async addCart() {
    const cart = {
      id: this.nextId++,
      products: [],
    };
    this.carts.push(cart);
    await this.saveCartsToFile();
    return cart;
  }

  async getCartById(id) {
    return this.carts.find((cart) => cart.id === id);
  }

  async getAllCarts() {
    return this.carts;
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const existingProduct = cart.products.find((product) => product.id === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }

    await this.saveCartsToFile();
  }

  async deleteCart(id) {
    console.log("Deleting cart with ID:", id);
    console.log("Current carts:", this.carts);
    this.carts = this.carts.filter((cart) => cart.id !== id);
    await this.saveCartsToFile();
  }

  async saveCartsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
      console.log("Carts saved");
    } catch (error) {
      console.error("Error saving carts to file:", error);
    }
  }

  async loadCartsFromFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      if (data.trim() === "") {
        this.carts = [];
      } else {
        this.carts = JSON.parse(data);
      }
      console.log("Carts loaded:", this.carts);
    } catch (error) {
      console.error("Error loading carts from file:", error);
      this.carts = [];
    }
  }
}

const cartManager = new CartManager(path);

export default cartManager;