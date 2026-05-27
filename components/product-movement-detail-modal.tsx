'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ProductMovement } from '@/lib/types'

interface ProductMovementDetailModalProps {
  movement: ProductMovement | null
  open: boolean
  onClose: () => void
}

const movementTypeLabels: Record<string, string> = {
  venda: 'Venda',
  devolucao: 'Devolução',
  entrada: 'Entrada',
  outro: 'Outro',
}

export function ProductMovementDetailModal({ movement, open, onClose }: ProductMovementDetailModalProps) {
  if (!movement) return null

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const total = movement.items.reduce(
    (acc, item) => acc + item.quantidade * item.precoVendaNoMomento,
    0
  )

  const showTotal = movement.tipo === 'venda' || movement.tipo === 'devolucao'

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Movimentação</DialogTitle>
          <DialogDescription>
            Informações completas sobre esta movimentação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Tipo:</span>
              <span className="ml-2 font-medium">{movementTypeLabels[movement.tipo]}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Data:</span>
              <span className="ml-2 font-medium">{formatDate(movement.createdAt)}</span>
            </div>
            {movement.customerNome && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Cliente:</span>
                <span className="ml-2 font-medium">{movement.customerNome}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Produtos</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  {showTotal && (
                    <>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {movement.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productNome}</TableCell>
                    <TableCell className="text-right">{item.quantidade}</TableCell>
                    {showTotal && (
                      <>
                        <TableCell className="text-right">
                          {formatCurrency(item.precoVendaNoMomento)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.quantidade * item.precoVendaNoMomento)}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {showTotal && (
            <div className="flex justify-end text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="ml-2 font-semibold">{formatCurrency(total)}</span>
            </div>
          )}

          {movement.observacao && (
            <div>
              <h4 className="text-sm font-medium mb-1">Observação</h4>
              <p className="text-sm text-muted-foreground">{movement.observacao}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
