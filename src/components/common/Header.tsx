import Logo from "./Logo";
import React from "react";

interface HeaderProps {
  showIcon: boolean; // 아이콘 표시 여부
  href: string;
  text: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // 아이콘 컴포넌트
}

export default function Header({ showIcon = true, href, text, Icon }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-brand-paper">
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          {showIcon && (
            <a
              href={href}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-brand-navy font-semibold transition-all duration-300
            bg-white hover:bg-brand-navy hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {text}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
