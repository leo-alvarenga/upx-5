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
import type { Customer } from '@/lib/types'

interface CustomersTableProps {
  customers: Customer[]
  onUpdateCustomer: (id: string, data: Omit<Customer, 'id'>) => void
  onDeleteCustomer: (id: string) => void
}

export function CustomersTable({ customers, onUpdateCustomer, onDeleteCustomer }: CustomersTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Omit<Customer, 'id'>>({
    nome: '',
    cpfCnpj: '',
    telefone: '',
    endereco: '',
  })

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id)
    setEditData({
      nome: customer.nome,
      cpfCnpj: customer.cpfCnpj,
      telefone: customer.telefone,
      endereco: customer.endereco,
    })
  }

  const handleSave = (id: string) => {
    if (editData.nome.trim() && editData.cpfCnpj.trim()) {
      onUpdateCustomer(id, editData)
    }
    setEditingId(null)
    setEditData({ nome: '', cpfCnpj: '', telefone: '', endereco: '' })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({ nome: '', cpfCnpj: '', telefone: '', endereco: '' })
  }

  const handleDelete = (id: string) => {
    onDeleteCustomer(id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Cadastrados</CardTitle>
        <CardDescription>
          Lista de todos os clientes registrados no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum cliente cadastrado ainda.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {editingId === customer.id ? (
                      <Input
                        value={editData.nome}
                        onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                        className="w-full"
                        autoFocus
                      />
                    ) : (
                      customer.nome
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === customer.id ? (
                      <Input
                        value={editData.cpfCnpj}
                        onChange={(e) => setEditData({ ...editData, cpfCnpj: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      customer.cpfCnpj
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === customer.id ? (
                      <Input
                        value={editData.telefone}
                        onChange={(e) => setEditData({ ...editData, telefone: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      customer.telefone
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {editingId === customer.id ? (
                      <Input
                        value={editData.endereco}
                        onChange={(e) => setEditData({ ...editData, endereco: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <span className="truncate block">{customer.endereco}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === customer.id ? (
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleSave(customer.id)}
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
                          onClick={() => handleEdit(customer)}
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
                                Tem certeza que deseja remover o cliente <strong>{customer.nome}</strong>? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(customer.id)}
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
