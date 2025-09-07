"use client";

import { useMemo, useState } from "react";
import { Loader2, Thermometer, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PredictionResponse = {
  year: number;
  temperature: number;
  unit: string;
  model: string;
};

function cToF(c: number) {
  return c * 1.8 + 32;
}

const currentYear = new Date().getFullYear();

export function Predictor() {
  const [year, setYear] = useState<number>(currentYear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [useFahrenheit, setUseFahrenheit] = useState(false);

  const displayTemperature = useMemo(() => {
    if (!result)
      return null;

    const tempC = result.temperature;

    return useFahrenheit ? cToF(tempC) : tempC;
  }, [result, useFahrenheit]);

  const displayUnit = useMemo(() => (useFahrenheit ? "°F" : "°C"), [useFahrenheit]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!year || Number.isNaN(year)) {
      setError("Please enter a valid year.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      const data = (await res.json()) as PredictionResponse;
      setResult(data);
    }
    catch (err: any) {
      setError(err?.message || "Something went wrong");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-background/60 to-muted/20 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]" />

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Thermometer className="h-5 w-5" />
            </span>
            Predict Global Average Temperature
          </CardTitle>

          <CardDescription>
            Enter a target year to estimate the planet's average surface temperature using a simplified model.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium">Year</label>
                <Input
                  id="year"
                  type="number"
                  inputMode="numeric"
                  min={1800}
                  max={2300}
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value || "0", 10))}
                  placeholder="e.g. 2050"
                  aria-invalid={!!error}
                />
                <p className="text-xs text-muted-foreground">Supported range: 1800 – 2300</p>
              </div>

              <div className="flex items-center">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto cursor-pointer text-foreground">
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Predicting...
                    </span>
                  ) : (
                    "Predict"
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background/40 p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                This demo uses a linear trend mock model for quick estimates.
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Display in °F</span>
                <Switch checked={useFahrenheit} onCheckedChange={setUseFahrenheit} />
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}

            {result && (
              <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-transparent p-5">
                <div className="text-sm text-muted-foreground">Prediction for {result.year}</div>
                <div className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">
                  {displayTemperature?.toFixed(2)} {displayUnit}
                </div>
                <div className="mt-1 text-xs italic text-muted-foreground">
                  Note: This is a simplified demo output and not intended for scientific use.
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border bg-background/40 p-3">
                    <div className="text-xs text-muted-foreground">Model</div>
                    <div className="text-sm font-medium">{result.model}</div>
                  </div>

                  <div className="rounded-lg border bg-background/40 p-3">
                    <div className="text-xs text-muted-foreground">Original Unit</div>
                    <div className="text-sm font-medium">{result.unit}</div>
                  </div>

                  <div className="rounded-lg border bg-background/40 p-3">
                    <div className="text-xs text-muted-foreground">Requested Year</div>
                    <div className="text-sm font-medium">{result.year}</div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
