'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Check, X } from 'lucide-react'
import { useText } from '@/hooks/use-text'
import type { Product } from '@/lib/types'

interface StockTableProps {
  products: Product[]
  onUpdateStock: (id: string, qtdEstoque: number) => void
}

export function StockTable({ products, onUpdateStock }: StockTableProps) {
  const { t } = useText()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditValue(product.qtdEstoque.toString())
  }

  const handleSave = (id: string) => {
    const newStock = parseInt(editValue, 10)
    if (!isNaN(newStock) && newStock >= 0) {
      onUpdateStock(id, newStock)
    }
    setEditingId(null)
    setEditValue('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('card.stock.title')}</CardTitle>
        <CardDescription>
          {t('card.stock.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {t('message.noProducts')}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('product.name')}</TableHead>
                <TableHead>{t('product.brand')}</TableHead>
                <TableHead>{t('product.supplier')}</TableHead>
                <TableHead className="text-right">{t('product.stockQuantity')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.nome}</TableCell>
                  <TableCell>{product.marca}</TableCell>
                  <TableCell>{product.fornecedor}</TableCell>
                  <TableCell className="text-right">
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 ml-auto text-right"
                        autoFocus
                      />
                    ) : (
                      product.qtdEstoque
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === product.id ? (
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleSave(product.id)}
                          aria-label={t('actions.save')}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={handleCancel}
                          aria-label={t('actions.cancel')}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        {t('actions.editStock')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
