'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useText } from '@/hooks/use-text'
import type { Product } from '@/lib/types'

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'qtdVendida' | 'qtdEstoque'>) => void
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const { t } = useText()
  const [formData, setFormData] = useState({
    nome: '',
    precoCusto: '',
    precoVenda: '',
    marca: '',
    fornecedor: '',
  })
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.precoCusto || !formData.precoVenda || !formData.marca || !formData.fornecedor) return

    onSubmit({
      nome: formData.nome,
      precoCusto: parseFloat(formData.precoCusto),
      precoVenda: parseFloat(formData.precoVenda),
      marca: formData.marca,
      fornecedor: formData.fornecedor,
    })

    setFormData({ nome: '', precoCusto: '', precoVenda: '', marca: '', fornecedor: '' })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>{t('card.registerProduct.title')}</CardTitle>
        <CardDescription>
          {t('card.registerProduct.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">{t('product.name')}</Label>
            <Input
              id="nome"
              placeholder={t('product.namePlaceholder')}
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precoCusto">{t('product.costPriceLabel')}</Label>
              <Input
                id="precoCusto"
                type="number"
                step="0.01"
                min="0"
                placeholder={t('product.costPricePlaceholder')}
                value={formData.precoCusto}
                onChange={(e) => setFormData(prev => ({ ...prev, precoCusto: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precoVenda">{t('product.salePriceLabel')}</Label>
              <Input
                id="precoVenda"
                type="number"
                step="0.01"
                min="0"
                placeholder={t('product.salePricePlaceholder')}
                value={formData.precoVenda}
                onChange={(e) => setFormData(prev => ({ ...prev, precoVenda: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marca">{t('product.brand')}</Label>
            <Input
              id="marca"
              placeholder={t('product.brandPlaceholder')}
              value={formData.marca}
              onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fornecedor">{t('product.supplier')}</Label>
            <Input
              id="fornecedor"
              placeholder={t('product.supplierPlaceholder')}
              value={formData.fornecedor}
              onChange={(e) => setFormData(prev => ({ ...prev, fornecedor: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Button type="submit">{t('actions.registerProduct')}</Button>
            {success && (
              <span className="text-sm text-green-600">{t('message.productSuccess')}</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
