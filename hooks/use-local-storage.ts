"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product, Customer, ProductMovement } from "@/lib/types";

const PRODUCTS_KEY = "microgestao_products";
const CUSTOMERS_KEY = "microgestao_customers";
const MOVEMENTS_KEY = "microgestao_movements";

const mockProducts: Product[] = [];
const mockCustomers: Customer[] = [];
const mockMovements: ProductMovement[] = [];

export function useLocalStorage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [movements, setMovements] = useState<ProductMovement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    const storedCustomers = localStorage.getItem(CUSTOMERS_KEY);
    const storedMovements = localStorage.getItem(MOVEMENTS_KEY);

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

    if (storedMovements) {
      setMovements(JSON.parse(storedMovements));
    } else {
      setMovements(mockMovements);
      localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(mockMovements));
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

  const addMovement = useCallback(
    (movement: Omit<ProductMovement, "id" | "createdAt">) => {
      const newMovement: ProductMovement = {
        ...movement,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // Atualizar estoque e qtdVendida dos produtos
      setProducts((prev) => {
        const updated = prev.map((product) => {
          const item = movement.items.find((i) => i.productId === product.id);
          if (!item) return product;

          let newQtdEstoque = product.qtdEstoque;
          let newQtdVendida = product.qtdVendida;

          switch (movement.tipo) {
            case "venda":
              newQtdEstoque -= item.quantidade;
              newQtdVendida += item.quantidade;
              break;
            case "devolucao":
              newQtdEstoque += item.quantidade;
              newQtdVendida -= item.quantidade;
              break;
            case "entrada":
              newQtdEstoque += item.quantidade;
              break;
            case "outro":
              newQtdEstoque -= item.quantidade;
              break;
          }

          return {
            ...product,
            qtdEstoque: Math.max(0, newQtdEstoque),
            qtdVendida: Math.max(0, newQtdVendida),
          };
        });

        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
        return updated;
      });

      // Salvar movimento
      setMovements((prev) => {
        const updated = [newMovement, ...prev];
        localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  return {
    products,
    customers,
    movements,
    isLoaded,
    addProduct,
    updateProductStock,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addMovement,
  };
}
