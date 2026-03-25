"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Charity } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function CharityDirectory({
  charities,
  categories,
}: {
  charities: Charity[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const deferredSearch = useDeferredValue(search);

  const filtered = charities.filter((charity) => {
    const matchesCategory = category === "All" || charity.category === category;
    const searchValue = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      searchValue.length === 0 ||
      charity.name.toLowerCase().includes(searchValue) ||
      charity.description.toLowerCase().includes(searchValue) ||
      charity.impactTag.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              Explore charities
            </p>
            <p className="text-sm text-muted">
              Search by mission or filter by cause to find the impact path that feels personal.
            </p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by cause, mission, or story"
            className="h-12 w-full rounded-full border border-line bg-white/80 px-5 outline-none md:max-w-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                category === item
                  ? "bg-secondary text-white"
                  : "border border-line bg-white/70 text-muted hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((charity) => (
          <Card key={charity.id} className="mesh-card flex h-full flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Badge tone={charity.featured ? "warning" : "default"}>
                  {charity.featured ? "Featured Charity" : charity.category}
                </Badge>
                <div>
                  <h3 className="display-font text-3xl font-semibold">{charity.name}</h3>
                  <p className="text-sm text-muted">{charity.impactTag}</p>
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 font-semibold">
                {charity.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <p className="text-sm leading-7 text-muted">{charity.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Raised so far</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {formatCurrency(charity.totalRaisedCents)}
                </p>
              </div>
              <div className="rounded-3xl bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Upcoming events</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {charity.upcomingEvents.length}
                </p>
              </div>
            </div>
            <Link
              href={`/charities/${charity.slug}`}
              className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
            >
              View charity profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        ))}
        {filtered.length === 0 ? (
          <Card className="border border-line bg-white/80 p-6 text-sm text-muted lg:col-span-2">
            No charities match the current filters yet.
          </Card>
        ) : null}
      </div>
    </div>
  );
}
