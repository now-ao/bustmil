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
import { ServiceOrder } from '@/lib/db/schema';
import { serviceOrderService } from '@/lib/services/serviceOrderService';
import { clientService } from '@/lib/services/clientService';
import { employeeService } from '@/lib/services/employeeService';
import { toast } from 'sonner';
import { Wrench, Plus, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ServiceOrders() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const [ordersData, clientsData, employeesData] = await Promise.all([
      serviceOrderService.getAll(),
      clientService.getAll(),
      employeeService.getAll(),
    ]);
    setOrders(ordersData.sort((a, b) => b.order_number - a.order_number));
    setClients(clientsData);
    setEmployees(employeesData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await serviceOrderService.create({
        order_number: await serviceOrderService.getNextOrderNumber(),
        client_id: formData.get('client_id') as string,
        equipment: formData.get('equipment') as string,
        serial_number: formData.get('serial_number') as string || undefined,
        reported_problem: formData.get('reported_problem') as string,
        diagnosis: undefined,
        solution: undefined,
        status: 'open',
        priority: (formData.get('priority') as any) || 'normal',
        assigned_to: formData.get('assigned_to') as string || undefined,
        start_date: new Date().toISOString(),
        estimated_completion: new Date(formData.get('estimated_completion') as string).toISOString(),
        labor_cost: 0,
        parts_cost: 0,
        total_cost: 0,
        notes: formData.get('notes') as string || undefined,
      });

      toast.success('Ordem de serviço criada!');
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      toast.error('Erro ao criar ordem de serviço');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      open: { label: 'Aberta', variant: 'secondary' },
      in_progress: { label: 'Em Andamento', variant: 'default' },
      waiting_parts: { label: 'Aguard. Peças', variant: 'default' },
      completed: { label: 'Concluída', variant: 'default' },
      cancelled: { label: 'Cancelada', variant: 'destructive' },
    };
    const { label, variant } = statusMap[status] || statusMap.open;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; variant: any }> = {
      low: { label: 'Baixa', variant: 'secondary' },
      normal: { label: 'Normal', variant: 'default' },
      high: { label: 'Alta', variant: 'default' },
      urgent: { label: 'Urgente', variant: 'destructive' },
    };
    const { label, variant } = priorityMap[priority] || priorityMap.normal;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Ordens de Serviço"
        description="Gerencie serviços e reparos"
      />

      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova OS
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Ordem de Serviço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Cliente *</Label>
                  <Select name="client_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
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
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select name="priority" defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipamento *</Label>
                  <Input id="equipment" name="equipment" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serial_number">Nº Série</Label>
                  <Input id="serial_number" name="serial_number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reported_problem">Problema Relatado *</Label>
                <Textarea id="reported_problem" name="reported_problem" required rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Responsável</Label>
                  <Select name="assigned_to">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_completion">Previsão</Label>
                  <Input
                    id="estimated_completion"
                    name="estimated_completion"
                    type="date"
                    defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>
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
                  {loading ? 'Salvando...' : 'Criar OS'}
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
              <TableHead>OS</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Equipamento</TableHead>
              <TableHead>Abertura</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const client = clients.find(c => c.id === order.client_id);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.order_number}</TableCell>
                  <TableCell>{client?.name || '-'}</TableCell>
                  <TableCell>{order.equipment}</TableCell>
                  <TableCell>{new Date(order.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
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
