'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ProductForm } from '@/components/product-form'
import { CustomerForm } from '@/components/customer-form'
import { ProductsTable } from '@/components/products-table'
import { CustomersTable } from '@/components/customers-table'
import { StockTable } from '@/components/stock-table'
import { ProductMovementForm } from '@/components/product-movement-form'
import { ProductMovementHistory } from '@/components/product-movement-history'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useText } from '@/hooks/use-text'
import type { ViewType } from '@/lib/types'

export default function HomePage() {
  const { t } = useText()
  const [currentView, setCurrentView] = useState<ViewType>('registrar-saida-entrada')
  const {
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
  } = useLocalStorage()

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      )
    }

    switch (currentView) {
      case 'registrar-saida-entrada':
        return (
          <ProductMovementForm
            products={products}
            customers={customers}
            onSubmit={addMovement}
          />
        )
      case 'historico-movimentos':
        return <ProductMovementHistory movements={movements} />
      case 'cadastrar-produto':
        return <ProductForm onSubmit={addProduct} />
      case 'cadastrar-cliente':
        return <CustomerForm onSubmit={addCustomer} />
      case 'produtos':
        return (
          <ProductsTable
            products={products}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        )
      case 'clientes':
        return (
          <CustomersTable
            customers={customers}
            onUpdateCustomer={updateCustomer}
            onDeleteCustomer={deleteCustomer}
          />
        )
      case 'gerenciar-estoque':
        return <StockTable products={products} onUpdateStock={updateProductStock} />
      default:
        return null
    }
  }

  const getPageTitle = () => {
    switch (currentView) {
      case 'registrar-saida-entrada':
        return t('nav.registerMovement')
      case 'historico-movimentos':
        return t('nav.movementHistory')
      case 'cadastrar-produto':
        return t('nav.registerProduct')
      case 'cadastrar-cliente':
        return t('nav.registerCustomer')
      case 'produtos':
        return t('nav.products')
      case 'clientes':
        return t('nav.customers')
      case 'gerenciar-estoque':
        return t('nav.manageStock')
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
