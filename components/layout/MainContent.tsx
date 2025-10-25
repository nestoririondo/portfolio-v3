"use client";

import { Hero, ProblemRecognition, Services, Approach, CaseStudy, About, Contact } from "@/components/sections";

export function MainContent() {
  return (
    <div className="pt-[70px] flex flex-col gap-[20rem] outline outline-1 outline-red-500">
      <Hero />
      <ProblemRecognition />
      <Services />
      <Approach />
      {/* <CaseStudy /> */}
      <About />
      <Contact />
    </div>
  );
}