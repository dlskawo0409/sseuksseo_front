import React from "react";

interface HoverButtonProps {
  href: string;
  text: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // 아이콘 컴포넌트 타입
}

export default function HoverButton({ href, text, Icon }: HoverButtonProps) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center rounded-xl border border-gray-300 px-8 py-4 
      text-brand-navy font-bold text-lg bg-white 
      hover:bg-brand-midnight hover:shadow-md hover:scale-105 hover:-translate-y-1 
      transition-all duration-300 hover:text-white"
    >
      <Icon className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
      {text}
    </a>
  );
}
