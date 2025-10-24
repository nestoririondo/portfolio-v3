"use client";

import { Hero, ProblemRecognition, Services, Approach, CaseStudy, About, Contact } from "@/components/sections";

export function MainContent() {
  return (
    <div className="pt-[70px] md:pt-20">
      <Hero />
      <ProblemRecognition />
      <Services />
      <Approach />
      <CaseStudy />
      <About />
      <Contact />
    </div>
  );
}