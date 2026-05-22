'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Customer } from '@/lib/types'

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id'>) => void
}

export function CustomerForm({ onSubmit }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cpfCnpj: '',
    telefone: '',
    endereco: '',
  })
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.cpfCnpj || !formData.telefone || !formData.endereco) return

    onSubmit({
      nome: formData.nome,
      cpfCnpj: formData.cpfCnpj,
      telefone: formData.telefone,
      endereco: formData.endereco,
    })

    setFormData({ nome: '', cpfCnpj: '', telefone: '', endereco: '' })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Cadastrar Novo Cliente</CardTitle>
        <CardDescription>
          Preencha os dados do cliente para adicioná-lo ao sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo / Razão Social</Label>
            <Input
              id="nome"
              placeholder="Ex: Maria Silva"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpfCnpj">CPF / CNPJ</Label>
            <Input
              id="cpfCnpj"
              placeholder="Ex: 123.456.789-00"
              value={formData.cpfCnpj}
              onChange={(e) => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              placeholder="Ex: (11) 99999-1234"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Button type="submit">Cadastrar Cliente</Button>
            {success && (
              <span className="text-sm text-green-600">Cliente cadastrado com sucesso!</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
