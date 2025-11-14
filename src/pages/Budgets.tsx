import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Budget } from '@/lib/db/schema';
import { budgetService } from '@/lib/services/budgetService';
import { clientService } from '@/lib/services/clientService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FileText, Plus, Eye, Trash2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Budgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const [budgetsData, clientsData] = await Promise.all([
      budgetService.getAll(),
      clientService.getAll(),
    ]);
    setBudgets(budgetsData.sort((a, b) => b.budget_number - a.budget_number));
    setClients(clientsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const items = JSON.parse(formData.get('items') as string || '[]');
      const totalAmount = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
      const discount = Number(formData.get('discount')) || 0;

      await budgetService.create({
        budget_number: await budgetService.getNextBudgetNumber(),
        client_id: formData.get('client_id') as string,
        user_id: user.id,
        issue_date: new Date().toISOString(),
        expiry_date: new Date(formData.get('expiry_date') as string).toISOString(),
        total_amount: totalAmount,
        discount,
        final_amount: totalAmount - discount,
        status: 'draft',
        items,
        notes: formData.get('notes') as string || undefined,
        terms: formData.get('terms') as string || undefined,
      });

      toast.success('Orçamento criado com sucesso!');
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      toast.error('Erro ao criar orçamento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      draft: { label: 'Rascunho', variant: 'secondary' },
      sent: { label: 'Enviado', variant: 'default' },
      approved: { label: 'Aprovado', variant: 'default' },
      rejected: { label: 'Rejeitado', variant: 'destructive' },
      expired: { label: 'Expirado', variant: 'destructive' },
      converted: { label: 'Convertido', variant: 'default' },
    };
    const { label, variant } = statusMap[status] || statusMap.draft;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Orçamentos"
        description="Gerencie propostas e orçamentos para clientes"
      />

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline">Todos</Button>
          <Button variant="ghost">Pendentes</Button>
          <Button variant="ghost">Aprovados</Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Orçamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Cliente *</Label>
                  <Select name="client_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Validade *</Label>
                  <Input
                    id="expiry_date"
                    name="expiry_date"
                    type="date"
                    required
                    defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="items">Itens (JSON) *</Label>
                <Textarea
                  id="items"
                  name="items"
                  placeholder='[{"description":"Item 1","quantity":1,"unit_price":100,"subtotal":100}]'
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Desconto (R$)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  step="0.01"
                  defaultValue="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Condições de Pagamento</Label>
                <Textarea id="terms" name="terms" rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea id="notes" name="notes" rows={2} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Criar Orçamento'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => {
              const client = clients.find(c => c.id === budget.client_id);
              return (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">#{budget.budget_number}</TableCell>
                  <TableCell>{client?.name || '-'}</TableCell>
                  <TableCell>{new Date(budget.issue_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(budget.expiry_date).toLocaleDateString()}</TableCell>
                  <TableCell>R$ {budget.final_amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(budget.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
