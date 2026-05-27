'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ProductForm } from '@/components/product-form'
import { CustomerForm } from '@/components/customer-form'
import { ProductsTable } from '@/components/products-table'
import { CustomersTable } from '@/components/customers-table'
import { StockTable } from '@/components/stock-table'
import { useLocalStorage } from '@/hooks/use-local-storage'
import type { ViewType } from '@/lib/types'

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>('gerenciar-estoque')
  const { products, customers, isLoaded, addProduct, updateProductStock, updateProduct, deleteProduct, addCustomer, updateCustomer, deleteCustomer } = useLocalStorage()

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      )
    }

    switch (currentView) {
      case 'cadastrar-produto':
        return <ProductForm onSubmit={addProduct} />
      case 'cadastrar-cliente':
        return <CustomerForm onSubmit={addCustomer} />
      case 'produtos':
        return <ProductsTable products={products} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />
      case 'clientes':
        return <CustomersTable customers={customers} onUpdateCustomer={updateCustomer} onDeleteCustomer={deleteCustomer} />
      case 'gerenciar-estoque':
        return <StockTable products={products} onUpdateStock={updateProductStock} />
      default:
        return null
    }
  }

  const getPageTitle = () => {
    switch (currentView) {
      case 'cadastrar-produto':
        return 'Cadastrar Produto'
      case 'cadastrar-cliente':
        return 'Cadastrar Cliente'
      case 'produtos':
        return 'Produtos'
      case 'clientes':
        return 'Clientes'
      case 'gerenciar-estoque':
        return 'Gerenciar Estoque'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="ml-64 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground">{getPageTitle()}</h2>
        </header>
        {renderContent()}
      </main>
    </div>
  )
}
