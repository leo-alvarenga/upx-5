'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye } from 'lucide-react'
import { ProductMovementDetailModal } from '@/components/product-movement-detail-modal'
import { useText } from '@/hooks/use-text'
import type { ProductMovement, MovementType } from '@/lib/types'

interface ProductMovementHistoryProps {
  movements: ProductMovement[]
}

export function ProductMovementHistory({ movements }: ProductMovementHistoryProps) {
  const { t } = useText()
  const [filterType, setFilterType] = useState<MovementType | 'todos'>('todos')
  const [selectedMovement, setSelectedMovement] = useState<ProductMovement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const movementTypeLabels: Record<MovementType, string> = {
    venda: t('movement.sale'),
    devolucao: t('movement.return'),
    entrada: t('movement.entry'),
    outro: t('movement.other'),
  }

  const filteredMovements = filterType === 'todos'
    ? movements
    : movements.filter((m) => m.tipo === filterType)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const getTotal = (movement: ProductMovement) => {
    if (movement.tipo !== 'venda' && movement.tipo !== 'devolucao') return null
    return movement.items.reduce(
      (acc, item) => acc + item.quantidade * item.precoVendaNoMomento,
      0
    )
  }

  const getTotalItems = (movement: ProductMovement) => {
    const total = movement.items.reduce((acc, item) => acc + item.quantidade, 0)
    return t('common.items', { count: total })
  }

  const handleViewDetails = (movement: ProductMovement) => {
    setSelectedMovement(movement)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedMovement(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('card.movementHistory.title')}</CardTitle>
          <CardDescription>
            {t('card.movementHistory.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as MovementType | 'todos')}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('movement.filterByType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('movement.all')}</SelectItem>
                <SelectItem value="venda">{t('movement.sale')}</SelectItem>
                <SelectItem value="devolucao">{t('movement.return')}</SelectItem>
                <SelectItem value="entrada">{t('movement.entry')}</SelectItem>
                <SelectItem value="outro">{t('movement.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredMovements.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t('message.noMovements')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('common.type')}</TableHead>
                  <TableHead>{t('customer.label')}</TableHead>
                  <TableHead>{t('common.items')}</TableHead>
                  <TableHead className="text-right">{t('common.total')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => {
                  const total = getTotal(movement)
                  return (
                    <TableRow key={movement.id}>
                      <TableCell>{formatDate(movement.createdAt)}</TableCell>
                      <TableCell>{movementTypeLabels[movement.tipo]}</TableCell>
                      <TableCell>{movement.customerNome || '-'}</TableCell>
                      <TableCell>{getTotalItems(movement)}</TableCell>
                      <TableCell className="text-right">
                        {total !== null ? formatCurrency(total) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(movement)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('common.view')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ProductMovementDetailModal
        movement={selectedMovement}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
