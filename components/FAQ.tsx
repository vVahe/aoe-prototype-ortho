import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { FAQ_QUESTIONS } from '@/lib/constants';

export default function FAQ() {
  return (
    <section id="faq" className="bg-secondary py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-heading mb-2 text-3xl font-bold text-primary md:text-4xl">
          Veelgestelde vragen over orthodontie
        </h2>
        <p className="mb-10 text-muted">
          Alles wat u wilt weten over behandelingen, kosten en vergoedingen.
        </p>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {FAQ_QUESTIONS.map((item, i) => (
            <Accordion.Item
              key={i}
              value={`item-${i}`}
              className="overflow-hidden rounded-xl bg-surface shadow-sm"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-neutral transition-colors hover:bg-secondary/60 data-[state=open]:bg-secondary/60">
                  <span>{item.question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="px-5 pb-5 pt-1 leading-relaxed text-neutral">
                  {item.answer}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
