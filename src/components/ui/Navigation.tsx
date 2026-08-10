import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ============================================
   Top Navigation
   ============================================ */

export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

export function TopNav({
  className,
  logo,
  actions,
  children,
  ...props
}: TopNavProps) {
  return (
    <nav
      className={cn(
        "h-16 bg-black border-b border-graphite flex items-center justify-between px-4 md:px-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        {logo && <div className="flex-shrink-0">{logo}</div>}
        {children}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </nav>
  );
}

/* ============================================
   Side Navigation
   ============================================ */

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function SideNav({
  className,
  header,
  footer,
  children,
  ...props
}: SideNavProps) {
  return (
    <aside
      className={cn(
        "w-60 h-full bg-charcoal border-r border-graphite flex flex-col",
        className
      )}
      {...props}
    >
      {header && (
        <div className="p-4 border-b border-graphite">{header}</div>
      )}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
      {footer && (
        <div className="p-4 border-t border-graphite">{footer}</div>
      )}
    </aside>
  );
}

/* ============================================
   Nav Item
   ============================================ */

export interface NavItemProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export function NavItem({
  className,
  href,
  icon,
  active = false,
  children,
  ...props
}: NavItemProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
        active
          ? "bg-gold/10 text-gold"
          : "text-silver-gray hover:text-white hover:bg-graphite",
        className
      )}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </a>
  );
}

/* ============================================
   Breadcrumbs
   ============================================ */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({
  className,
  items,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      className={cn("flex items-center gap-2 text-sm", className)}
      aria-label="Breadcrumb"
      {...props}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-silver-gray" aria-hidden="true">
              /
            </span>
          )}
          {item.href ? (
            <a
              href={item.href}
              className="text-silver-gray hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-white" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

/* ============================================
   Tabs
   ============================================ */

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({
  className,
  tabs,
  activeTab,
  onTabChange,
  ...props
}: TabsProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex border-b border-graphite">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-200",
              activeTab === tab.id
                ? "border-gold text-gold"
                : "border-transparent text-silver-gray hover:text-white"
            )}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4" role="tabpanel">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

/* ============================================
   Pagination
   ============================================ */

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  ...props
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className={cn("flex items-center gap-1", className)}
      aria-label="Pagination"
      {...props}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-11 h-11 flex items-center justify-center rounded text-silver-gray hover:text-white hover:bg-graphite disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "w-11 h-11 flex items-center justify-center rounded text-sm font-medium transition-colors",
            page === currentPage
              ? "bg-gold text-black"
              : "text-silver-gray hover:text-white hover:bg-graphite"
          )}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-11 h-11 flex items-center justify-center rounded text-silver-gray hover:text-white hover:bg-graphite disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
