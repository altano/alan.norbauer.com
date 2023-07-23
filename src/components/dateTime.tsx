"use client";

export default function DateTime({ date: dateOrStr }: { date: string | Date }) {
  const date = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  return (
    <time
      dateTime={date.toISOString()}
      className="mb-2 block text-xs text-gray-600"
    >
      {date.toLocaleDateString()}
    </time>
  );
}
