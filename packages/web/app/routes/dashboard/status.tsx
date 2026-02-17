import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import StatusBox from "./status-box";
import {
  DoorClosedLocked,
  FileSpreadsheet,
  Globe,
  MoveDown,
  MoveUp,
  NotebookTabs,
  Phone,
  Regex,
} from "lucide-react";
import type { Route } from "./+types/status";
import { getExtensionCount } from "~/models/extensions.server";
import { getContactCount } from "~/models/contacts.server";
import { useRevalidator } from "react-router";
import { useEffect } from "react";
import { getTrunksCount } from "~/models/trunks.server";
import { getCosCount } from "~/models/class-of-service.server";
import { getNumberManipulationsCount } from "~/models/number-manipulation.server";
import { getInboundRoutesCount } from "~/models/inbound-routing.server";
import { getOutboundRoutesCount } from "~/models/outbound-routing.server";
import {
  getCdrCount,
  getLastTenDaysInboundCDRData,
  getLastTenDaysOutboundCDRData,
} from "~/models/cdr.server";
import LastTenAreaChart from "./last-ten-area-chart";

export async function loader() {
  const extensionCount = await getExtensionCount();
  const registrationCunt = await getContactCount();
  const trunkCount = await getTrunksCount();
  const cosCount = await getCosCount();
  const numberManipulationCount = await getNumberManipulationsCount();
  const inboundRouteCount = await getInboundRoutesCount();
  const outboundRouteCount = await getOutboundRoutesCount();
  const cdrCount = await getCdrCount();

  const inboundData = await getLastTenDaysInboundCDRData();
  const outboundData = await getLastTenDaysOutboundCDRData();
  const lastTenData = mergeCallData(inboundData, outboundData);

  return {
    extensionCount,
    registrationCunt,
    trunkCount,
    cosCount,
    numberManipulationCount,
    inboundRouteCount,
    outboundRouteCount,
    cdrCount,
    lastTenData,
  };
}

export default function DashboardStatus({ loaderData }: Route.ComponentProps) {
  const revalidator = useRevalidator();
  useEffect(() => {
    // Set up an interval to refresh every 30 seconds
    const interval = setInterval(() => {
      // Only revalidate if the document is visible and not already loading
      if (document.visibilityState === "visible" && revalidator.state === "idle") {
        revalidator.revalidate();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [revalidator]);
  return (
    <div className=" flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Status Dashboard</CardTitle>
          <CardDescription>Quick stats and access to configuration data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* First row */}
              <StatusBox
                title="Extensions"
                count={loaderData.extensionCount}
                linkUrl="/extensions"
                icon={Phone}
                iconColor="blue"
              />
              <StatusBox
                title="Registered Extensions"
                count={loaderData.registrationCunt}
                linkUrl="/inbound-registrations"
                icon={NotebookTabs}
                iconColor="red"
              />
              <StatusBox
                title="Trunks"
                count={loaderData.trunkCount}
                linkUrl="/trunks"
                icon={Globe}
                iconColor="green"
              />
              <StatusBox
                title="Class of Service"
                count={loaderData.cosCount}
                linkUrl="/class-of-service"
                icon={DoorClosedLocked}
                iconColor="orange"
              />
              {/* Second row */}
              <StatusBox
                title="Number Manipulations"
                count={loaderData.numberManipulationCount}
                linkUrl="/number-manipulations"
                icon={Regex}
                iconColor="violet"
              />
              <StatusBox
                title="Inbound routes"
                count={loaderData.inboundRouteCount}
                linkUrl="/inbound-routing"
                icon={MoveDown}
                iconColor="yellow"
              />
              <StatusBox
                title="Outbound routes"
                count={loaderData.outboundRouteCount}
                linkUrl="/outbound-routing"
                icon={MoveUp}
                iconColor="pink"
              />
              <StatusBox
                title="Call Detail Records"
                count={loaderData.cdrCount}
                linkUrl="/cdr"
                icon={FileSpreadsheet}
                iconColor="orange"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <LastTenAreaChart data={loaderData.lastTenData} />
    </div>
  );
}

function getLastTenDays() {
  const dates = [];
  // Use a temporary date object to avoid modifying the original 'today' repeatedly within the loop
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(today); // Create a fresh copy for each iteration
    // Subtract 'i' days from today's date
    date.setDate(today.getDate() - i);

    // Format the date as YYYY-MM-DD
    const formattedDate =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" + // getMonth() is 0-based
      String(date.getDate()).padStart(2, "0");

    dates.push(formattedDate);
  }

  // The array will be in order from today to 9 days ago.
  return dates;
}

function generateTestData() {
  const dates = getLastTenDays();
  const data = dates.map((date) => ({
    call_date: date,
    inbound: Math.floor(Math.random() * 100) + 1,
    outbound: Math.floor(Math.random() * 100) + 1, // Random value between 1 and 100
  }));
  return data;
}

function mergeCallData(
  inboundData: { call_date: string; call_count: number }[],
  outboundData: { call_date: string; call_count: number }[],
) {
  const mergedMap = new Map();

  // 1. Process inbound
  inboundData.forEach((item) => {
    mergedMap.set(item.call_date, { ...item, outbound: 0 });
  });

  // 2. Process outbound (merge into existing or create new)
  outboundData.forEach((item) => {
    const existing = mergedMap.get(item.call_date);
    if (existing) {
      mergedMap.set(item.call_date, { ...existing, outbound: item.call_count });
    } else {
      mergedMap.set(item.call_date, {
        call_date: item.call_date,
        inbound: 0,
        outbound: item.call_count,
      });
    }
  });

  return Array.from(mergedMap.values());
}
