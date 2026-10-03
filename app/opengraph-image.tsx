import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/lib/content";

export const alt = `${profile.fullName} — ${profile.role}, Lagos, Nigeria`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (p: string) => readFile(join(process.cwd(), p));

export default async function Image() {
  const [serif, serifItalic, mono, portrait] = await Promise.all([
    asset("assets/fonts/Fraunces-Medium.ttf"),
    asset("assets/fonts/Fraunces-Italic.ttf"),
    asset("assets/fonts/JetBrainsMono-Medium.ttf"),
    asset("public/opeyemi.png"),
  ]);
  const photo = `data:image/png;base64,${portrait.toString("base64")}`;

  const label = { fontFamily: "Mono", fontSize: 18, letterSpacing: 3, textTransform: "uppercase" as const };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F8FAFC", color: "#0B1F3A" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 0 56px 64px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ ...label, display: "flex" }}>
              <span style={{ color: "#E8584F" }}>No. 01</span>
              <span style={{ marginLeft: 16 }}>— The Portfolio Issue</span>
            </div>
            <div style={{ height: 2, background: "#0B1F3A", marginTop: 18, width: 620 }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Fraunces", lineHeight: 0.9 }}>
            <span style={{ fontSize: 148, letterSpacing: -5 }}>{profile.firstName}</span>
            <span style={{ fontSize: 148, letterSpacing: -5, fontFamily: "FrauncesItalic", fontStyle: "italic", display: "flex" }}>
              {profile.lastName}
              <span style={{ color: "#E8584F" }}>.</span>
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "FrauncesItalic", fontStyle: "italic", fontSize: 34, color: "#E8584F" }}>{profile.role}</span>
            <span style={{ ...label, marginTop: 14, color: "rgba(11,31,58,0.65)" }}>
              Data · Growth · Communication — Lagos, Nigeria
            </span>
          </div>
        </div>

        <div style={{ width: 400, display: "flex", position: "relative", background: "#DCE4EE" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" width={400} height={630} style={{ width: 400, height: 630, objectFit: "cover", objectPosition: "50% 15%" }} />
          <div
            style={{
              position: "absolute",
              left: -60,
              bottom: 56,
              width: 120,
              height: 120,
              borderRadius: 60,
              background: "#E8584F",
              color: "#F8FAFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "FrauncesItalic", fontStyle: "italic",
              fontSize: 44,
            }}
          >
            AO
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: serif, style: "normal", weight: 500 },
        { name: "FrauncesItalic", data: serifItalic, style: "italic", weight: 400 },
        { name: "Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
