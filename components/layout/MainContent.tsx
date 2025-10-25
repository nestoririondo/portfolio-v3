"use client";

import { Hero, ProblemRecognition, Services, Approach, CaseStudy, About, Contact } from "@/components/sections";

export function MainContent() {
  return (
    <div className="flex flex-col gap-[20rem]">
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