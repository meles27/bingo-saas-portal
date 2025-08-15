import { type MouseEvent, useRef } from "react";

export function useActiveTableRow() {
  const tableRef = useRef<HTMLTableElement>(null);

  const onRowClick = (e: MouseEvent<HTMLTableRowElement>) => {
    if (!tableRef.current) return;

    const prev = tableRef.current.querySelector(".active-row");
    if (prev) prev.classList.remove("active-row");

    e.currentTarget.classList.add("active-row");
  };

  return { tableRef, onRowClick };
}
