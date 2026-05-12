import { PRACTICE_INFO } from '@/lib/constants';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Behandelingen', href: '#behandelingen' },
  { label: 'Resultaten', href: '#resultaten' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Recensies', href: '#recensies' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ practiceName, noSticky }: { practiceName?: string; noSticky?: boolean }) {
  const name = practiceName ?? PRACTICE_INFO.name;
  const positionClasses = noSticky ? '' : 'sticky top-0 z-40';
  return (
    <nav className={`${positionClasses} hidden border-b border-border bg-surface shadow-sm md:flex`}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <a href="#home" className="font-heading text-lg font-bold text-primary">
          {name}
        </a>
        <ul className="flex items-center gap-6 text-sm font-medium text-primary">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded border-b-2 border-transparent pb-0.5 transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
