'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useText } from '@/hooks/use-text'
import type { Customer } from '@/lib/types'

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id'>) => void
}

export function CustomerForm({ onSubmit }: CustomerFormProps) {
  const { t } = useText()
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
        <CardTitle>{t('card.registerCustomer.title')}</CardTitle>
        <CardDescription>
          {t('card.registerCustomer.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">{t('customer.fullName')}</Label>
            <Input
              id="nome"
              placeholder={t('customer.namePlaceholder')}
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpfCnpj">{t('customer.cpfCnpj')}</Label>
            <Input
              id="cpfCnpj"
              placeholder={t('customer.cpfCnpjPlaceholder')}
              value={formData.cpfCnpj}
              onChange={(e) => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">{t('customer.phone')}</Label>
            <Input
              id="telefone"
              placeholder={t('customer.phonePlaceholder')}
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endereco">{t('customer.address')}</Label>
            <Input
              id="endereco"
              placeholder={t('customer.addressPlaceholder')}
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Button type="submit">{t('actions.registerCustomer')}</Button>
            {success && (
              <span className="text-sm text-green-600">{t('message.customerSuccess')}</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
