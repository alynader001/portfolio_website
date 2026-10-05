export default function TextBlock({ children }: { children?: React.ReactNode }) {
  return <div className="max-w-prose">{children}</div>;
}
