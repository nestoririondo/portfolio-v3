"use client";

import {
  Hero,
  Services,
  About,
  Contact,
} from "@/components/sections";
import { ChatDemo } from "@/components/sections/ChatDemo";

export function MainContent() {
  return (
    <div className="flex flex-col gap-[20rem]">
      <Hero />
      <Services />
      <ChatDemo />
      <About />
      <Contact />
    </div>
  );
}
