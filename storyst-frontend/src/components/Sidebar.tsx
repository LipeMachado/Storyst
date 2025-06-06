import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label, active }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
      )}
    >
      <div className="text-lg">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
            Storyst
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <SidebarItem
            href="/"
            icon={<span>📊</span>}
            label="Dashboard"
            active={location.pathname === '/'}
          />
          <SidebarItem
            href="/customers"
            icon={<span>👥</span>}
            label="Clientes"
            active={location.pathname === '/customers'}
          />
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">
                {user?.name.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {user?.email || 'usuario@email.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-full hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
              title="Sair da conta"
            >
              <LogOut size={23} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;