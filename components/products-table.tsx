'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Pencil, Check, X, Trash2 } from 'lucide-react'
import type { Product } from '@/lib/types'

interface ProductsTableProps {
  products: Product[]
  onUpdateProduct: (id: string, data: Omit<Product, 'id' | 'qtdVendida' | 'qtdEstoque'>) => void
  onDeleteProduct: (id: string) => void
}

export function ProductsTable({ products, onUpdateProduct, onDeleteProduct }: ProductsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Omit<Product, 'id' | 'qtdVendida' | 'qtdEstoque'>>({
    nome: '',
    preco: 0,
    marca: '',
    fornecedor: '',
  })

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditData({
      nome: product.nome,
      preco: product.preco,
      marca: product.marca,
      fornecedor: product.fornecedor,
    })
  }

  const handleSave = (id: string) => {
    if (editData.nome.trim() && editData.preco >= 0) {
      onUpdateProduct(id, editData)
    }
    setEditingId(null)
    setEditData({ nome: '', preco: 0, marca: '', fornecedor: '' })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({ nome: '', preco: 0, marca: '', fornecedor: '' })
  }

  const handleDelete = (id: string) => {
    onDeleteProduct(id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Cadastrados</CardTitle>
        <CardDescription>
          Lista de todos os produtos registrados no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum produto cadastrado ainda.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-right">Preco</TableHead>
                <TableHead className="text-right">Qtd Vendida</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {editingId === product.id ? (
                      <Input
                        value={editData.nome}
                        onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                        className="w-full"
                        autoFocus
                      />
                    ) : (
                      product.nome
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        value={editData.marca}
                        onChange={(e) => setEditData({ ...editData, marca: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      product.marca
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        value={editData.fornecedor}
                        onChange={(e) => setEditData({ ...editData, fornecedor: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      product.fornecedor
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editData.preco}
                        onChange={(e) => setEditData({ ...editData, preco: parseFloat(e.target.value) || 0 })}
                        className="w-28 ml-auto text-right"
                      />
                    ) : (
                      formatCurrency(product.preco)
                    )}
                  </TableCell>
                  <TableCell className="text-right">{product.qtdVendida}</TableCell>
                  <TableCell className="text-right">
                    {editingId === product.id ? (
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleSave(product.id)}
                          aria-label="Salvar"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={handleCancel}
                          aria-label="Cancelar"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remover
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o produto <strong>{product.nome}</strong>? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
