import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Calls",
  },
  inbound: {
    label: "Inbound",
    color: "var(--chart-1)",
  },
  outbound: {
    label: "Outbound",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export interface LastTenAreaChartProps {
  data: {
    call_date: string;
    inbound: number;
    outbound: number;
  }[];
}

export default function LastTenAreaChart(props: LastTenAreaChartProps) {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Calls count</CardTitle>
          <CardDescription>Showing total calls for the last 10 days</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full">
          <AreaChart data={props.data}>
            <defs>
              <linearGradient id="fillInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-inbound)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-inbound)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-outbound)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-outbound)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="call_date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="inbound"
              fill="url(#fillInbound)"
              stroke="var(--color-inbound)"
              stackId="a"
            />
            <Area
              dataKey="outbound"
              fill="url(#fillOutbound)"
              stroke="var(--color-outbound)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
