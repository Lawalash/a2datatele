import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden mr-2">
          <Menu className="w-5 h-5 text-slate-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-none">
        {/* Usamos o próprio componente Sidebar com z-index alto para cobrir as opções */}
        <div className="h-full relative overflow-hidden" onClick={() => setOpen(false)}>
          <Sidebar inSheet />
        </div>
      </SheetContent>
    </Sheet>
  );
}
