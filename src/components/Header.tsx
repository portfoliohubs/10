import { Link } from 'wouter';
import { useTheme } from 'next-themes';
import { Sun, Moon, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import CONFIG from '../config';

interface HeaderProps {
  showBack?: boolean;
}

export default function Header({ showBack = false }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/90 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {CONFIG.brand.logoUrl ? (
            <img
              src={CONFIG.brand.logoUrl}
              alt={CONFIG.brand.name}
              className="h-8 w-8 object-contain rounded"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm leading-none select-none">P</span>
            </div>
          )}
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
              {CONFIG.brand.name}
            </span>
            <span
              className="text-[10px] text-muted-foreground font-arabic leading-tight hidden sm:block"
              dir="rtl"
            >
              {CONFIG.brand.slogan}
            </span>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {showBack && (
            <Link href="/">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
            </Link>
          )}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
