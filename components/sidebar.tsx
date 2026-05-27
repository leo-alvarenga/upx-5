'use client'

import { Package, Users, ShoppingBag, Warehouse, UserPlus, ArrowLeftRight, History } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewType } from '@/lib/types'

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const navItems: { view: ViewType; label: string; icon: React.ElementType }[] = [
  { view: 'registrar-saida-entrada', label: 'Registrar Saída ou Entrada', icon: ArrowLeftRight },
  { view: 'historico-movimentos', label: 'Histórico de Movimentos', icon: History },
  { view: 'gerenciar-estoque', label: 'Gerenciar Estoque', icon: Warehouse },
  { view: 'produtos', label: 'Produtos', icon: ShoppingBag },
  { view: 'cadastrar-produto', label: 'Cadastrar Produto', icon: Package },
  { view: 'clientes', label: 'Clientes', icon: Users },
  { view: 'cadastrar-cliente', label: 'Cadastrar Cliente', icon: UserPlus },
]

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <h1 className="text-lg font-semibold text-foreground">MicroGestão</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                currentView === view
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            Alinhado com ODS 9 da ONU
          </p>
        </div>
      </div>
    </aside>
  )
}
