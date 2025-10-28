"use client";

import { Hero, Services, About, Contact } from "@/components/sections";
import { ChatDemo } from "@/components/sections/ChatDemo";

export function MainContent() {
  return (
    <div className="flex flex-col gap-80">
      <Hero />
      <Services />
      <About />
      <ChatDemo />
      <Contact />
    </div>
  );
}
