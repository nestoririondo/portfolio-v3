"use client";

import { Hero, ProblemRecognition, Services, Approach, CaseStudy, About, Contact } from "@/components/sections";
import { ChatDemo } from "@/components/sections/ChatDemo";

export function MainContent() {
  return (
    <div className="flex flex-col gap-[20rem]">
      <Hero />
      <ProblemRecognition />
      <Services />
      <ChatDemo />
      <Approach />
      {/* <CaseStudy /> */}
      <About />
      <Contact />
    </div>
  );
}