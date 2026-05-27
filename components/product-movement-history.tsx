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
import type { ProductMovement, MovementType } from '@/lib/types'

interface ProductMovementHistoryProps {
  movements: ProductMovement[]
}

const movementTypeLabels: Record<MovementType, string> = {
  venda: 'Venda',
  devolucao: 'Devolução',
  entrada: 'Entrada',
  outro: 'Outro',
}

export function ProductMovementHistory({ movements }: ProductMovementHistoryProps) {
  const [filterType, setFilterType] = useState<MovementType | 'todos'>('todos')
  const [selectedMovement, setSelectedMovement] = useState<ProductMovement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

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
    return total === 1 ? '1 item' : `${total} itens`
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
          <CardTitle>Histórico de Movimentos</CardTitle>
          <CardDescription>
            Visualize todas as entradas e saídas de produtos registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as MovementType | 'todos')}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
                <SelectItem value="devolucao">Devolução</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredMovements.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma movimentação registrada ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
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
                          Ver
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
