"use client";

import {
  Package,
  Users,
  ShoppingBag,
  Warehouse,
  UserPlus,
  ArrowLeftRight,
  History,
  Sheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useText } from "@/hooks/use-text";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { ViewType } from "@/lib/types";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { t } = useText();

  const navItems: {
    view: ViewType;
    labelKey: string;
    icon: React.ElementType;
  }[] = [
    {
      view: "registrar-saida-entrada",
      labelKey: "nav.registerMovement",
      icon: ArrowLeftRight,
    },
    {
      view: "historico-movimentos",
      labelKey: "nav.movementHistory",
      icon: History,
    },
    { view: "gerenciar-estoque", labelKey: "nav.manageStock", icon: Warehouse },
    { view: "produtos", labelKey: "nav.products", icon: ShoppingBag },
    {
      view: "cadastrar-produto",
      labelKey: "nav.registerProduct",
      icon: Package,
    },
    { view: "clientes", labelKey: "nav.customers", icon: Users },
    {
      view: "cadastrar-cliente",
      labelKey: "nav.registerCustomer",
      icon: UserPlus,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        <div className="inline-flex gap-4 h-16 items-center border-b border-border px-6">
          <span>
            <Sheet />
          </span>
          <h1 className="text-xl font-semibold text-foreground">
            {t("common.appName")}
          </h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ view, labelKey, icon: Icon }) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                currentView === view
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {t(labelKey)}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4 space-y-3">
          <LanguageSwitcher />
          <p className="text-xs text-muted-foreground">{t("common.footer")}</p>
        </div>
      </div>
    </aside>
  );
}
