import Bounded from "@/components/Bounded";
import Background3D from "./Background3D";

type HeroProps = {
  firstName: string;
  lastName: string;
  tagLine: string;
  intro: string;
};

export default function Hero({ firstName, lastName, tagLine, intro }: HeroProps) {
  return (
    <>
    <Background3D/>
    <Bounded>
      <div className="max-w-3xl">
        <h1 className="mb-6 text-[clamp(3rem,12vmin,10rem)] font-extrabold leading-none
          tracking-tighter" aria-label={firstName + " " + lastName}>
          <span className="text-slate-300">{firstName}</span>
          <span className="-mt-[.2em] block text-slate-300">{lastName}</span>
          <span className="block bg-gradient-to-tr from-green-600 via-green-200
         to-green-600 bg-clip-text text-2xl font-bold uppercase tracking-[.2em]
          text-transparent opacity-100 md:text-4xl">{tagLine}</span>
        </h1>
        <p className="text-lg leading-relaxed text-slate-300 md:text-xl">{intro}</p>
      </div>
    </Bounded>
    </>
  );
}
