'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Product, Customer } from '@/lib/types'

const PRODUCTS_KEY = 'microgestao_products'
const CUSTOMERS_KEY = 'microgestao_customers'

const mockProducts: Product[] = [
  { id: '1', nome: 'Camiseta Básica', preco: 49.90, marca: 'Fashion Co', fornecedor: 'Têxtil Brasil', qtdVendida: 25, qtdEstoque: 100 },
  { id: '2', nome: 'Calça Jeans', preco: 129.90, marca: 'DenimPro', fornecedor: 'Jeans Import', qtdVendida: 15, qtdEstoque: 50 },
  { id: '3', nome: 'Tênis Casual', preco: 199.90, marca: 'StepWalk', fornecedor: 'Calçados Elite', qtdVendida: 8, qtdEstoque: 30 },
  { id: '4', nome: 'Boné Esportivo', preco: 39.90, marca: 'SportCap', fornecedor: 'Acessórios Mix', qtdVendida: 42, qtdEstoque: 200 },
]

const mockCustomers: Customer[] = [
  { id: '1', nome: 'Maria Silva', cpfCnpj: '123.456.789-00', telefone: '(11) 99999-1234', endereco: 'Rua das Flores, 123 - São Paulo, SP' },
  { id: '2', nome: 'João Souza', cpfCnpj: '987.654.321-00', telefone: '(21) 98888-5678', endereco: 'Av. Brasil, 456 - Rio de Janeiro, RJ' },
  { id: '3', nome: 'Empresa ABC Ltda', cpfCnpj: '12.345.678/0001-90', telefone: '(31) 97777-9012', endereco: 'Rua Industrial, 789 - Belo Horizonte, MG' },
]

export function useLocalStorage() {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const storedProducts = localStorage.getItem(PRODUCTS_KEY)
    const storedCustomers = localStorage.getItem(CUSTOMERS_KEY)

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    } else {
      setProducts(mockProducts)
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mockProducts))
    }

    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    } else {
      setCustomers(mockCustomers)
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(mockCustomers))
    }

    setIsLoaded(true)
  }, [])

  const addProduct = useCallback((product: Omit<Product, 'id' | 'qtdVendida' | 'qtdEstoque'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      qtdVendida: 0,
      qtdEstoque: 0,
    }
    setProducts(prev => {
      const updated = [...prev, newProduct]
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateProductStock = useCallback((id: string, qtdEstoque: number) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, qtdEstoque } : p)
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const addCustomer = useCallback((customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
    }
    setCustomers(prev => {
      const updated = [...prev, newCustomer]
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
    products,
    customers,
    isLoaded,
    addProduct,
    updateProductStock,
    addCustomer,
  }
}
