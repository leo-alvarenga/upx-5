'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useText } from '@/hooks/use-text'
import type { Product, Customer, ProductMovement, MovementType, ProductMovementItem } from '@/lib/types'

interface ProductMovementFormProps {
  products: Product[]
  customers: Customer[]
  onSubmit: (movement: Omit<ProductMovement, 'id' | 'createdAt'>) => void
}

export function ProductMovementForm({ products, customers, onSubmit }: ProductMovementFormProps) {
  const { t } = useText()
  const [tipo, setTipo] = useState<MovementType>('venda')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [customerOpen, setCustomerOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [productOpen, setProductOpen] = useState(false)
  const [quantidade, setQuantidade] = useState<number>(1)
  const [items, setItems] = useState<ProductMovementItem[]>([])
  const [observacao, setObservacao] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requiresCustomer = tipo === 'venda' || tipo === 'devolucao'
  const isStockOut = tipo === 'venda' || tipo === 'outro'

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)
  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleAddProduct = () => {
    if (!selectedProduct) return

    // Verificar se já existe na lista
    const existingIndex = items.findIndex((i) => i.productId === selectedProduct.id)
    if (existingIndex !== -1) {
      setError(t('error.productAlreadyAdded'))
      return
    }

    // Verificar estoque para saídas
    if (isStockOut && quantidade > selectedProduct.qtdEstoque) {
      setError(t('error.insufficientStock', { available: selectedProduct.qtdEstoque.toString() }))
      return
    }

    if (quantidade <= 0) {
      setError(t('error.quantityMustBePositive'))
      return
    }

    const newItem: ProductMovementItem = {
      productId: selectedProduct.id,
      productNome: selectedProduct.nome,
      quantidade,
      precoVendaNoMomento: selectedProduct.precoVenda,
    }

    setItems([...items, newItem])
    setSelectedProductId(null)
    setQuantidade(1)
    setError(null)
  }

  const handleRemoveProduct = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (items.length === 0) {
      setError(t('error.addAtLeastOneProduct'))
      return
    }

    if (requiresCustomer && !selectedCustomerId) {
      setError(t('error.selectCustomer'))
      return
    }

    const movement: Omit<ProductMovement, 'id' | 'createdAt'> = {
      tipo,
      items,
      ...(requiresCustomer && selectedCustomer
        ? { customerId: selectedCustomer.id, customerNome: selectedCustomer.nome }
        : {}),
      ...(observacao ? { observacao } : {}),
    }

    onSubmit(movement)

    // Reset form
    setTipo('venda')
    setSelectedCustomerId(null)
    setItems([])
    setObservacao('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const total = items.reduce((acc, item) => acc + item.quantidade * item.precoVendaNoMomento, 0)

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{t('card.movement.title')}</CardTitle>
        <CardDescription>
          {t('card.movement.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Movimento */}
          <div className="space-y-2">
            <Label>{t('movement.type')}</Label>
            <Select value={tipo} onValueChange={(value) => setTipo(value as MovementType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="venda">{t('movement.sale')}</SelectItem>
                <SelectItem value="devolucao">{t('movement.return')}</SelectItem>
                <SelectItem value="entrada">{t('movement.entry')}</SelectItem>
                <SelectItem value="outro">{t('movement.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cliente (apenas para venda/devolução) */}
          {requiresCustomer && (
            <div className="space-y-2">
              <Label>{t('customer.label')}</Label>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="w-full justify-between"
                  >
                    {selectedCustomer ? selectedCustomer.nome : t('search.customer')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t('search.customer')} />
                    <CommandList>
                      <CommandEmpty>{t('search.noCustomerFound')}</CommandEmpty>
                      <CommandGroup>
                        {customers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.nome}
                            onSelect={() => {
                              setSelectedCustomerId(customer.id)
                              setCustomerOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedCustomerId === customer.id ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {customer.nome}
                            <span className="ml-2 text-muted-foreground text-xs">
                              {customer.cpfCnpj}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Adicionar Produto */}
          <div className="space-y-2">
            <Label>{t('movement.addProduct')}</Label>
            <div className="flex gap-2">
              <Popover open={productOpen} onOpenChange={setProductOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={productOpen}
                    className="flex-1 justify-between"
                  >
                    {selectedProduct ? selectedProduct.nome : t('search.product')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t('search.product')} />
                    <CommandList>
                      <CommandEmpty>{t('search.noProductFound')}</CommandEmpty>
                      <CommandGroup>
                        {products.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.nome}
                            onSelect={() => {
                              setSelectedProductId(product.id)
                              setProductOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedProductId === product.id ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {product.nome}
                            <span className="ml-2 text-muted-foreground text-xs">
                              {t('product.stockLabel', { quantity: product.qtdEstoque.toString() })}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                className="w-24"
                placeholder={t('common.quantity')}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddProduct}
                disabled={!selectedProduct}
              >
                <Plus className="h-4 w-4 mr-1" />
                {t('actions.add')}
              </Button>
            </div>
          </div>

          {/* Lista de Produtos Adicionados */}
          {items.length > 0 && (
            <div className="space-y-2">
              <Label>{t('movement.addedProducts')}</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.product')}</TableHead>
                    <TableHead className="text-right">{t('common.quantity')}</TableHead>
                    <TableHead className="text-right">{t('movement.unitPrice')}</TableHead>
                    <TableHead className="text-right">{t('movement.subtotal')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.productNome}</TableCell>
                      <TableCell className="text-right">{item.quantidade}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.precoVendaNoMomento)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.quantidade * item.precoVendaNoMomento)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleRemoveProduct(item.productId)}
                          className="text-red-600 hover:text-red-700"
                          aria-label={t('actions.remove')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(tipo === 'venda' || tipo === 'devolucao') && (
                <div className="flex justify-end text-sm pt-2">
                  <span className="text-muted-foreground">{t('common.total')}</span>
                  <span className="ml-2 font-semibold">{formatCurrency(total)}</span>
                </div>
              )}
            </div>
          )}

          {/* Observação */}
          <div className="space-y-2">
            <Label htmlFor="observacao">{t('movement.observationOptional')}</Label>
            <Textarea
              id="observacao"
              placeholder={t('movement.observationPlaceholder')}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Botão de Submit */}
          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={items.length === 0}>
              {t('actions.registerMovement')}
            </Button>
            {success && (
              <span className="text-sm text-green-600">{t('message.movementSuccess')}</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
