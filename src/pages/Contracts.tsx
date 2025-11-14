import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { contractService } from '@/lib/services/contractService';
import { Contract } from '@/lib/db/schema';
import { FileCheck, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    contractService.getAll().then(setContracts);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      draft: 'secondary',
      expired: 'destructive',
      cancelled: 'destructive',
      suspended: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Contratos" description="Gerencie contratos comerciais" />
      <div className="flex justify-end">
        <Button><Plus className="w-4 h-4 mr-2" />Novo Contrato</Button>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Término</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.contract_number}</TableCell>
                <TableCell>{contract.title}</TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell>{new Date(contract.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(contract.end_date).toLocaleDateString()}</TableCell>
                <TableCell>R$ {contract.value.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(contract.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
