import { Metric } from "@/components/dash/primitives";
import { MiniArea } from "@/components/dash/charts";
import { generateSeries } from "@/lib/data";

export function StatGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Metric label="Today · Leads"      value="48"     delta="+12"   tone="info"    spark={<MiniArea data={generateSeries(24,11,40,8)}  color="var(--info)" />} />
      <Metric label="Today · Sales"      value="9"      delta="+3"    tone="ai"      spark={<MiniArea data={generateSeries(24,12,40,8)}  color="var(--ai)" />} />
      <Metric label="Today · Revenue"    value="$4,820" delta="+24%"  tone="success" spark={<MiniArea data={generateSeries(24,13,60,12)} color="var(--success)" />} />
      <Metric label="Today · Commission" value="$1,062" delta="+18%"  tone="market"  spark={<MiniArea data={generateSeries(24,14,60,10)} color="var(--market)" />} />
      <Metric label="Conversion"         value="18.4%"  delta="+2.1pp"tone="warning" spark={<MiniArea data={generateSeries(24,15,40,6)}  color="var(--warning)" />} />
    </div>
  );
}
