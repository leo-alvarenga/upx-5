export interface Product {
  id: string
  nome: string
  precoCusto: number
  precoVenda: number
  marca: string
  fornecedor: string
  qtdVendida: number
  qtdEstoque: number
}

export interface Customer {
  id: string
  nome: string
  cpfCnpj: string
  telefone: string
  endereco: string
}

export type MovementType = 'venda' | 'devolucao' | 'entrada' | 'outro'

export interface ProductMovementItem {
  productId: string
  productNome: string
  quantidade: number
  precoVendaNoMomento: number
}

export interface ProductMovement {
  id: string
  tipo: MovementType
  items: ProductMovementItem[]
  customerId?: string
  customerNome?: string
  observacao?: string
  createdAt: string
}

export type ViewType =
  | 'registrar-saida-entrada'
  | 'historico-movimentos'
  | 'gerenciar-estoque'
  | 'produtos'
  | 'cadastrar-produto'
  | 'clientes'
  | 'cadastrar-cliente'
