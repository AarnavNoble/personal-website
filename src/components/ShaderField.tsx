"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed WebGL backdrop: domain-warped fBm noise coloured as a slow
 * marbled green fluid. Evolves over time, drifts toward the cursor, and
 * fades down once you scroll past the hero. Dependency-free; falls back to
 * a static CSS gradient if WebGL is unavailable or motion is reduced.
 */

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i+vec2(0.0,0.0)),hash(i+vec2(1.0,0.0)),u.x),
             mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0; float a=0.5;
  mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<4;i++){ v+=a*noise(p); p=m*p; a*=0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;
  float t = u_time * 0.045;
  vec2 mo = (u_mouse - 0.5) * 0.35;

  vec2 q = vec2(fbm(p*1.7 + t + mo), fbm(p*1.7 + vec2(5.2,1.3) - t));
  vec2 r = vec2(fbm(p*1.7 + 3.0*q + vec2(1.7,9.2) + t*1.3),
                fbm(p*1.7 + 3.0*q + vec2(8.3,2.8) - t*1.1));
  float f = fbm(p*1.7 + 3.5*r);

  vec3 cNear = vec3(0.028,0.036,0.032);
  vec3 cDeep = vec3(0.050,0.235,0.165);
  vec3 cMint = vec3(0.290,0.840,0.640);
  vec3 cTeal = vec3(0.045,0.105,0.125);

  vec3 col = mix(cNear, cDeep, clamp(f*f*2.4, 0.0, 1.0));
  col = mix(col, cMint, clamp(length(r)*0.5, 0.0, 1.0));
  col = mix(col, cTeal, clamp(q.x*0.65, 0.0, 1.0));
  col *= 0.62 + 0.62*f;

  float vig = smoothstep(1.3, 0.32, length(uv - 0.5));
  col *= mix(0.5, 1.0, vig);
  col += (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.028;

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

export function ShaderField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    wrap.style.setProperty("--sf-ready", "1");

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const SCALE = 0.62;
    let raf = 0;
    let running = true;
    const start = performance.now();
    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };

    const resize = () => {
      const w = Math.max(1, Math.floor(window.innerWidth * SCALE));
      const h = Math.max(1, Math.floor(window.innerHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const frame = () => {
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (running) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
      wrap.style.setProperty("--sf-fade", String(1 - p * 0.82));
    };
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduce) {
      gl.uniform1f(uTime, 12.0);
      gl.uniform2f(uMouse, 0.5, 0.5);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      if (!coarse) window.addEventListener("mousemove", onMove);
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 0,
        opacity: "var(--sf-fade, 1)",
        transition: "opacity 0.2s linear",
        background:
          "radial-gradient(120% 90% at 30% 10%, #0f2a20, #080a09 70%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: "block", filter: "blur(0.4px)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,10,9,0.15) 0%, transparent 30%, transparent 62%, rgba(8,10,9,0.55) 100%)",
        }}
      />
    </div>
  );
}
