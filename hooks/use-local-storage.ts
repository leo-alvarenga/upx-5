"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product, Customer } from "@/lib/types";

const PRODUCTS_KEY = "microgestao_products";
const CUSTOMERS_KEY = "microgestao_customers";

const mockProducts: Product[] = [];
const mockCustomers: Customer[] = [];

export function useLocalStorage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    const storedCustomers = localStorage.getItem(CUSTOMERS_KEY);

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(mockProducts);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mockProducts));
    }

    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      setCustomers(mockCustomers);
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(mockCustomers));
    }

    setIsLoaded(true);
  }, []);

  const addProduct = useCallback(
    (product: Omit<Product, "id" | "qtdVendida" | "qtdEstoque">) => {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        qtdVendida: 0,
        qtdEstoque: 0,
      };

      setProducts((prev) => {
        const updated = [...prev, newProduct];
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const updateProductStock = useCallback((id: string, qtdEstoque: number) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, qtdEstoque } : p));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateProduct = useCallback(
    (id: string, data: Omit<Product, "id" | "qtdVendida" | "qtdEstoque">) => {
      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addCustomer = useCallback((customer: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
    };
    setCustomers((prev) => {
      const updated = [...prev, newCustomer];
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateCustomer = useCallback((id: string, data: Omit<Customer, "id">) => {
    setCustomers((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    products,
    customers,
    isLoaded,
    addProduct,
    updateProductStock,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
