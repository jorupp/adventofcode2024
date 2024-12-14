export default function Json({ children, format }: { children: any; format?: boolean }) {
  if (format) {
    return <pre>{JSON.stringify(children, null, 2)}</pre>;
  }
  return <pre>{JSON.stringify(children)}</pre>;
}

export function JsonList({ children, format }: { children: any[]; format?: boolean }) {
  return (
    <ul>
      {children.map((i, idx) => (
        <li key={idx}>
          <Json format={format}>{i}</Json>
        </li>
      ))}
    </ul>
  );
}
