import fs from 'node:fs/promises'
const path = "../datos/products.json";

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.nextId = 1;
    this.initializeFile();
  }

  async initializeFile() {
    try {
      await fs.access(this.path);
      console.log("File exists. Loading products...");
      await this.loadProductsFromFile();
    } catch (error) {
      console.log("File does not exist. Creating new file...");
      await fs.writeFile(this.path, "[]");
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("All fields are required");
    }

    const codeExists = this.products.some((product) => product.code === code);
    if (codeExists) {
      throw new Error("The code already exists");
    }

    const product = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
    await this.saveProductsToFile();
  }

  async updateProduct(id, newData) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }

    this.products[index] = { ...this.products[index], ...newData };
    await this.saveProductsToFile();
  }

  async deleteProduct(id) {
    console.log("Deleting product with ID:", id);
    console.log("Current products:", this.products);
    this.products = this.products.filter((product) => product.id !== id);
    await this.saveProductsToFile();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  async saveProductsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
      console.log("Saved");
    } catch (error) {
      console.error("Error saving products to file:", error);
    }
  }

  async loadProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      if (data.trim() === "") {
        this.products = [];
      } else {
        this.products = JSON.parse(data);
      }
      console.log("Products loaded:", this.products);
    } catch (error) {
      console.error("Error loading products from file:", error);
      this.products = [];
    }
  }
}

const productManager = new ProductManager("../datos/products.json");