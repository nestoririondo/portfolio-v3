"use client";

import { Hero, About, Contact } from "@/components/sections";
import { ChatDemo } from "@/components/sections/ChatDemo";
import { Process } from "@/components/sections/Process";

export function MainContent() {
  return (
    <div className="flex flex-col gap-28">
      <Hero />
      <Process />
      <ChatDemo />
      <Contact />
      <About />
    </div>
  );
}
