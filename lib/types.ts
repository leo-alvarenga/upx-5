export interface Product {
  id: string
  nome: string
  preco: number
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

export type ViewType = 'cadastrar-produto' | 'produtos' | 'gerenciar-estoque' | 'cadastrar-cliente' | 'clientes'
