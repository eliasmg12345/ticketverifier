"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Interval {
  min: number;
  max: number;
}

interface IntervalsData {
  Bs10: Interval[];
  Bs20: Interval[];
  Bs50: Interval[];
}

export default function HomePage() {
  const [numberValue, setNumberValue] = useState<string>("");
  const [category, setCategory] = useState<"Bs10" | "Bs20" | "Bs50">("Bs10");
  const [intervals, setIntervals] = useState<IntervalsData | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/intervals.json")
      .then((res) => res.json())
      .then((data: IntervalsData) => setIntervals(data))
      .catch((err) => {
        console.error("fallo en leer los intervalos", err);
        setIntervals(null);
      });
  }, []);

  useEffect(() => {
    if (!numberValue) {
      setResult(null);
      return;
    }

    const parsed = parseInt(numberValue, 10);
    if (isNaN(parsed)) {
      setResult("Por favor ingresa un número válido.");
      return;
    }

    if (!intervals) {
      setResult("Los intervalos aún no se han cargado.");
      return;
    }

    const list = intervals[category];
    const permitted = list.some((int) => parsed >= int.min && parsed <= int.max);

    setResult(
      permitted
        ? `✗ El número ${parsed} NO tiene valor legal en la categoria ${category}.`
        : `El número no se encuentra en los intervalos.`
    );
  }, [numberValue, category, intervals]);

  return (
    <main className="p-8 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">Verificador de billetes habilitados serie B</CardTitle>
          <CardDescription>Selecciona la categoría e ingresa el numero de serie</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as "Bs10" | "Bs20" | "Bs50")}
              className="mt-1 block w-full rounded-md border-input bg-transparent px-3 py-2 border"
            >
              <option value="Bs10">Bs10</option>
              <option value="Bs20">Bs20</option>
              <option value="Bs50">Bs50</option>
            </select>
          </div>

          <div>
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              type="number"
              value={numberValue}
              onChange={(e) => setNumberValue(e.target.value)}
              placeholder="Ingresa un número"
            />
          </div>

          {result && <p className="mt-4 font-medium text-base">{result}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
