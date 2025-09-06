"use client";

import { useSearchParams } from "next/navigation";
import PowerBIEmbed from "@/components/powerbi/PowerBIEmbed";

// Note: Backend will provide a valid embed or AAD access token separately.
// This page expects `token` to be passed via query param for demo. DO NOT hardcode secrets.
// Example usage (replace TOKEN):
//   /powerbi?type=report&reportId=eb57fee3-dcab-41f9-b003-99610d8c8391&embedUrl=https%3A%2F%2Fapp.powerbi.com%2FreportEmbed%3FreportId%3Deb57fee3-dcab-41f9-b003-99610d8c8391&token=TOKEN

export default function PowerBIPage() {
  const params = useSearchParams();

  // Defaults from user's info
  const defaultReportId = "eb57fee3-dcab-41f9-b003-99610d8c8391";
  const defaultEmbedUrl =
    "https://app.powerbi.com/reportEmbed?reportId=eb57fee3-dcab-41f9-b003-99610d8c8391";

  const type = (params.get("type") || "report") as "report" | "dashboard";
  const reportId = params.get("reportId") || defaultReportId;
  const dashboardId = params.get("dashboardId") || undefined;
  const embedUrl = params.get("embedUrl") || defaultEmbedUrl;
  const token = params.get("token") || "";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {token ? (
        <div className="mx-auto max-w-[1400px] h-[80vh]">
          <PowerBIEmbed
            type={type}
            embedUrl={embedUrl}
            accessToken={token}
            reportId={type === "report" ? reportId : undefined}
            dashboardId={type === "dashboard" ? dashboardId : undefined}
            settings={{}}
            className="rounded-xl border"
          />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl rounded-xl border p-6 bg-card text-card-foreground">
          <h1 className="text-xl font-semibold mb-2">Power BI Embed</h1>
          <p className="text-sm text-muted-foreground">
            Provide a valid Power BI embed token via the <code>?token=</code>{" "}
            query parameter to view the report.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              Example:{" "}
              <code>
                /powerbi?type=report&reportId={defaultReportId}&embedUrl=
                {encodeURIComponent(defaultEmbedUrl)}&token=YOUR_EMBED_TOKEN
              </code>
            </p>
            <p className="text-xs text-muted-foreground">
              Tokens must be generated server-side by your backend. This page
              doesn't modify or call the backend.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
