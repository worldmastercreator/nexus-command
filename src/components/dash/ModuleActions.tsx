import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createOrder, refundOrder, revokeLicense } from "@/lib/modules.functions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Undo2, Ban } from "lucide-react";

function invalidate(qc: ReturnType<typeof useQueryClient>, table: string) {
  qc.invalidateQueries({ queryKey: ["module", table] });
}

export function NewOrderButton() {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("99.00");
  const qc = useQueryClient();
  const fn = useServerFn(createOrder);
  const mut = useMutation({
    mutationFn: () => fn({ data: { customer, product, amount: Number(amount) } }),
    onSuccess: ({ row }) => {
      invalidate(qc, "mod_orders");
      toast.success(`Order ${row?.order_no ?? ""} created`);
      setOpen(false);
      setCustomer(""); setProduct(""); setAmount("99.00");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1.5 text-[11px]">
          <Plus className="h-3 w-3" />New order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="font-mono text-[12px] uppercase tracking-wider">New order</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Customer</Label>
            <Input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Acme Corp" /></div>
          <div className="space-y-1"><Label className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Product</Label>
            <Input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Pro Plan · Annual" /></div>
          <div className="space-y-1"><Label className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Amount (USD)</Label>
            <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => mut.mutate()} disabled={mut.isPending || !customer || !product}>
            {mut.isPending ? "Creating…" : "Create order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RefundOrderButton() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const qc = useQueryClient();
  const fn = useServerFn(refundOrder);
  const mut = useMutation({
    mutationFn: () => fn({ data: { id: id.trim() } }),
    onSuccess: () => {
      invalidate(qc, "mod_orders");
      invalidate(qc, "mod_payments");
      toast.success("Order refunded");
      setOpen(false); setId("");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1.5 text-[11px]">
          <Undo2 className="h-3 w-3" />Refund
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="font-mono text-[12px] uppercase tracking-wider">Process refund</DialogTitle></DialogHeader>
        <div className="space-y-1">
          <Label className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Order ID (uuid)</Label>
          <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="Paste the row id from the orders table" className="font-mono text-[11px]" />
          <p className="text-[10.5px] text-muted-foreground">Tip: click ⋯ on any order row to copy its id from the View dialog.</p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => mut.mutate()} disabled={mut.isPending || !id.trim()}>
            {mut.isPending ? "Refunding…" : "Confirm refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RevokeLicenseButton() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const qc = useQueryClient();
  const fn = useServerFn(revokeLicense);
  const mut = useMutation({
    mutationFn: () => fn({ data: { id: id.trim() } }),
    onSuccess: () => {
      invalidate(qc, "mod_licenses");
      toast.success("License revoked");
      setOpen(false); setId("");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1.5 text-[11px]">
          <Ban className="h-3 w-3" />Revoke
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="font-mono text-[12px] uppercase tracking-wider">Revoke license</DialogTitle></DialogHeader>
        <div className="space-y-1">
          <Label className="text-[10.5px] uppercase tracking-wider text-muted-foreground">License row ID (uuid)</Label>
          <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="Paste the row id from the licenses table" className="font-mono text-[11px]" />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => mut.mutate()} disabled={mut.isPending || !id.trim()}>
            {mut.isPending ? "Revoking…" : "Confirm revoke"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
