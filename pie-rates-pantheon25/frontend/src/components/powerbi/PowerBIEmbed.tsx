"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  type: "report" | "dashboard";
  embedUrl: string;
  accessToken: string; // embed token or AAD access token
  reportId?: string;
  dashboardId?: string;
  settings?: Record<string, unknown>;
  className?: string;
};

const PowerBIEmbed: React.FC<Props> = ({
  type,
  embedUrl,
  accessToken,
  reportId,
  dashboardId,
  settings,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const serviceRef = useRef<any>(null);

  useEffect(() => {
    let embedded: any;

    const run = async () => {
      if (!containerRef.current) return;

      // Import on client only to avoid SSR ("self is not defined")
      const pbi = await import("powerbi-client");

      // Create service
      const service = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory
      );
      serviceRef.current = service;

      const config: any = {
        type,
        tokenType: pbi.models.TokenType.Embed,
        accessToken,
        embedUrl,
        settings: {
          background: pbi.models.BackgroundType.Transparent,
          panes: {
            filters: { expanded: false, visible: false },
          },
          ...settings,
        },
      };

      if (type === "report" && reportId) config.id = reportId;
      if (type === "dashboard" && dashboardId) config.id = dashboardId;

      embedded = service.embed(containerRef.current, config);
    };

    run();

    return () => {
      try {
        if (embedded?.destroy) embedded.destroy();
        if (serviceRef.current && containerRef.current) {
          serviceRef.current.reset(containerRef.current);
        }
      } catch {
        // no-op
      }
    };
  }, [type, embedUrl, accessToken, reportId, dashboardId, settings]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default PowerBIEmbed;
