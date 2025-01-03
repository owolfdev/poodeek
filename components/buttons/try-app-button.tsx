import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function TryAppButton() {
  return (
    <div className="flex justify-center py-10">
      {" "}
      <Link href="/phrase">
        <Button size="lg" className="py-8 px-10">
          <span className="text-4xl">Try The App</span>
        </Button>
      </Link>
    </div>
  );
}

export default TryAppButton;
