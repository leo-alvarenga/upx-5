'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Product } from '@/lib/types'

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'qtdVendida' | 'qtdEstoque'>) => void
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    marca: '',
    fornecedor: '',
  })
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.preco || !formData.marca || !formData.fornecedor) return

    onSubmit({
      nome: formData.nome,
      preco: parseFloat(formData.preco),
      marca: formData.marca,
      fornecedor: formData.fornecedor,
    })

    setFormData({ nome: '', preco: '', marca: '', fornecedor: '' })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Cadastrar Novo Produto</CardTitle>
        <CardDescription>
          Preencha os dados do produto para adicioná-lo ao sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto</Label>
            <Input
              id="nome"
              placeholder="Ex: Camiseta Básica"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 49.90"
              value={formData.preco}
              onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marca">Marca</Label>
            <Input
              id="marca"
              placeholder="Ex: Fashion Co"
              value={formData.marca}
              onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input
              id="fornecedor"
              placeholder="Ex: Têxtil Brasil"
              value={formData.fornecedor}
              onChange={(e) => setFormData(prev => ({ ...prev, fornecedor: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Button type="submit">Cadastrar Produto</Button>
            {success && (
              <span className="text-sm text-green-600">Produto cadastrado com sucesso!</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
