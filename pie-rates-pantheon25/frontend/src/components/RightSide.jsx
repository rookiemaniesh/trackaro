"use client";

import React, { useRef } from "react";

const RightSide = () => {
  const rightRef = useRef(null);

  return (
    <>
      <aside
        ref={rightRef}
        className="relative hidden lg:flex items-center justify-center px-6 sm:px-10 py-16 lg:py-24 bg-[#0b0b0b] text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative max-w-xl mx-auto">
          {/* Mock frame */}
          <div className="rounded-2xl border border-white/10 bg-[#121212]/80 backdrop-blur p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 text-sm opacity-80">
              <span>Sales pipeline</span>
              <span className="inline-flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3">
              {[1, 2, 3].map((col) => (
                <div key={col} className="space-y-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 h-28" />
                  <div className="rounded-lg border border-white/10 bg-white/5 h-28" />
                  <div className="rounded-lg border border-white/10 bg-white/5 h-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Trust row */}
          <div className="mt-10 grid grid-cols-3 gap-6 text-center opacity-80">
            <div>
              <div className="text-3xl font-semibold">4.9</div>
              <div className="text-xs mt-1">Product Hunt</div>
            </div>
            <div>
              <div className="text-3xl font-semibold">4.8</div>
              <div className="text-xs mt-1">Chrome Store</div>
            </div>
            <div>
              <div className="text-3xl font-semibold">4.5</div>
              <div className="text-xs mt-1">G2 Review</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default RightSide;
