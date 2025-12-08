"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type Props = {
  attributes: Map<
    string,
    {
      keyTranslation?: string;
      values: Set<{ value: string; translatedValue?: string; isSet: boolean }>;
    }
  >;
  baseUrl: string;
  searchParams?: URLSearchParams;
};

export function ProductFilters({ attributes, baseUrl, searchParams }: Props) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Map<string, Set<string>>
  >(new Map());

  useEffect(() => {
    const initialSelected = new Map<string, Set<string>>();
    attributes.forEach((attr, key) => {
      const selectedValues = new Set<string>();
      attr.values.forEach((val) => {
        if (val.isSet) {
          selectedValues.add(val.value);
        }
      });
      if (selectedValues.size > 0) {
        initialSelected.set(key, selectedValues);
      }
    });
    setSelectedAttributes(initialSelected);
  }, [attributes]);

  const [isFormChanged, setIsFormChanged] = useState(false);

  const router = useRouter();

  function applyFilters() {
    const sp = searchParams ?? new URLSearchParams();
    selectedAttributes.forEach((values, key) => {
      values.forEach((v) => {
        sp.append(key, v);
      });
    });

    router.push(`${baseUrl}?${sp.toString()}`);
  }

  return (
    <div className="flex flex-col gap-y-6 relative">
      {[...attributes.entries()].map(([key, value]) => {
        return (
          <div key={key} className="flex flex-col gap-y-2">
            <span className="font-medium text-secondary-foreground capitalize">
              {value.keyTranslation || key}
            </span>
            <div className="flex flex-col gap-y-1">
              {[...value.values].map((v) => (
                <div key={v.value} className="flex gap-x-1">
                  <input
                    id={`${key}-${v.value}`}
                    type="checkbox"
                    value={v.value}
                    checked={selectedAttributes.get(key)?.has(v.value) ?? false}
                    onChange={() => {
                      setIsFormChanged(true);
                      setSelectedAttributes((prev) => {
                        const newSelected = new Map();
                        prev.forEach((set, k) => {
                          newSelected.set(k, new Set(set));
                        });
                        if (!newSelected.has(key)) {
                          newSelected.set(key, new Set());
                        }
                        const valueSet = newSelected.get(key)!;
                        if (valueSet.has(v.value)) {
                          valueSet.delete(v.value);
                          if (valueSet.size === 0) {
                            newSelected.delete(key);
                          }
                        } else {
                          valueSet.add(v.value);
                        }
                        return newSelected;
                      });
                    }}
                  />
                  <Label className="text-sm" htmlFor={`${key}-${v.value}`}>
                    {v.translatedValue || v.value}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <Button
        disabled={!isFormChanged}
        onClick={() => {
          applyFilters();
          setIsFormChanged(false);
        }}
        className="sticky bottom-2"
      >
        Apply filters
      </Button>
    </div>
  );
}
