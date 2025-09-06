"use client";

import React from "react";
import Button from "@/components/Button";

export default function ButtonDemo() {
  return (
    <div className="min-h-screen bg-trackaro-bg p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Button Component Demo
      </h1>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Size Variations</h2>
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            text="Small Button"
            onClick={() => console.log("Small button clicked")}
            size="small"
          />

          <Button
            text="Medium Button"
            onClick={() => console.log("Medium button clicked")}
            size="medium"
            initiallyExpanded={true}
          />

          <Button
            text="Large Button"
            onClick={() => console.log("Large button clicked")}
            size="large"
            delay={1500}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Variant Styles</h2>
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            text="Primary Button"
            onClick={() => console.log("Primary button clicked")}
            variant="primary"
            initiallyExpanded={true}
          />

          <Button
            text="Secondary Button"
            onClick={() => console.log("Secondary button clicked")}
            variant="secondary"
            initiallyExpanded={true}
          />

          <Button
            text="Outline Button"
            onClick={() => console.log("Outline button clicked")}
            variant="outline"
            initiallyExpanded={true}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Animation Demo</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            text="Animated Button 1"
            onClick={() => console.log("Animated button 1 clicked")}
            delay={1000}
          />

          <Button
            text="Animated Button 2"
            onClick={() => console.log("Animated button 2 clicked")}
            delay={2000}
          />

          <Button
            text="Animated Button 3"
            onClick={() => console.log("Animated button 3 clicked")}
            delay={3000}
          />
        </div>

        <div className="mt-12 p-6 border border-trackaro-accent rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Custom Usage Example</h2>
          <p className="mb-6">
            Here's how you might use this button in your chat application:
          </p>

          <div className="flex justify-center">
            <Button
              text="Start New Chat"
              onClick={() => console.log("Starting new chat")}
              className="font-semibold"
              size="large"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
  