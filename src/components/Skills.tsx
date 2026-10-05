import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

export default function Skills({ skills }: { skills: { label: string; value: string }[] }) {
  return (
    <Bounded>
      <Heading as="h2" size="md" className="mb-8">
        Skills
      </Heading>
      <dl className="grid gap-6 sm:grid-cols-2">
        {skills.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-lg font-bold text-green-500">{label}</dt>
            <dd className="mt-1 text-slate-300">{value}</dd>
          </div>
        ))}
      </dl>
    </Bounded>
  );
}
