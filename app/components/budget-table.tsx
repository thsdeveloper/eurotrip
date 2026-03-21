import { budgetItems } from "@/app/data/trip";
import { Wallet } from "lucide-react";

export function BudgetTable() {
  const grouped = budgetItems.reduce(
    (acc, item) => {
      if (!acc[item.city]) acc[item.city] = [];
      acc[item.city].push(item);
      return acc;
    },
    {} as Record<string, typeof budgetItems>
  );

  return (
    <section id="budget" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Wallet size={28} className="text-emerald-400" />
          <h2 className="text-2xl font-bold sm:text-3xl">
            Custos Estimados
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card text-left text-xs text-muted">
                <th className="px-4 py-3 font-medium">Destino</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium text-right">
                  Por pessoa
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  Total (4p)
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([city, items]) =>
                items.map((item, i) => (
                  <tr
                    key={`${city}-${i}`}
                    className="border-b border-border/50 transition-colors hover:bg-card-hover"
                  >
                    {i === 0 ? (
                      <td
                        className="px-4 py-2.5 font-medium"
                        rowSpan={items.length}
                      >
                        {city}
                      </td>
                    ) : null}
                    <td className="px-4 py-2.5">{item.item}</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">
                      {item.costPerPerson}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs font-medium text-emerald-400">
                      {item.totalCost}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted">
          * Valores estimados. Preços podem variar. Não inclui hospedagem,
          alimentação e transporte local.
        </p>
      </div>
    </section>
  );
}
