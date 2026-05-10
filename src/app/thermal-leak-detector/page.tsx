import type { Metadata } from "next";
import Bounded from "@/components/Bounded";
import ThermalLeakDetector from "@/components/thermal-leak-detector/ThermalLeakDetector";

export const metadata: Metadata = {
  title: "Thermal Leak Detector | Aly N. Ahmed",
  description: "Classical computer vision demo for detecting warm thermal seams around doors and windows.",
};

export default function Page() {
  return (
    <Bounded className="min-h-screen pt-28 md:pt-32">
      <ThermalLeakDetector />
    </Bounded>
  );
}
