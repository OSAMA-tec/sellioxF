import React from "react";
import TopNav from "./sections/TopSection";
import SearchSection from "./sections/SearchSection";

export default function Header() {
  return (
    <header className="w-full capitalize font-semibold relative">
      <TopNav />
      <SearchSection />
      <hr className="my-4" />
    </header>
  );
}
