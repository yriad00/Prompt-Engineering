'use client'

import { SplineScene } from "@/components/ui/splite";
 
export function SplineSceneBasic() {
  return (
    <div className="w-full h-[500px] relative overflow-hidden">
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  )
} 