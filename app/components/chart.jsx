import { forwardRef } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useMediaQuery } from "react-responsive";

export default forwardRef(function Chart({ data }, ref) {
  const notMobile = useMediaQuery({ query: "(min-width: 640px)" });
  if (data.length < 2) return null;
  const handicaps = data.map((v) => v.y);
  return (
    <div className="my-3 h-80 bg-white rounded-sm" ref={ref}>
      <ResponsiveLine
        data={[{ id: "historico", data }]}
        margin={{ top: 30, right: 50, bottom: 50, left: 80 }}
        xScale={{
          type: "time",
          format: "%Q",
        }}
        xFormat="time:%Q"
        yScale={{
          type: "linear",
          min: handicaps.reduce((acc, v) => Math.min(acc, v)) - 0.2,
          max: handicaps.reduce((acc, v) => Math.max(acc, v)) + 0.2,
        }}
        theme={{
          axis: { legend: { text: { fontSize: 16, fontWeight: 600 } } },
        }}
        axisLeft={{
          legend: "Hándicap",
          legendOffset: -58,
          legendPosition: "middle",
          tickSize: 5,
          tickPadding: 12,
          tickValues: 5,
          format: ">-.1f",
        }}
        colors={{ scheme: "category10" }}
        axisBottom={{
          format: (time) => {
            // adding 3 hours just because times are set at midnight in utc-3
            time.setHours(time.getHours() + 3);
            return time.toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
            });
          },
          tickValues: notMobile ? "every 7 days" : "every 14 days",
          tickPadding: 12,
        }}
        layers={["grid", "axes", "points", "lines"]}
        pointSize={16}
        pointLabelYOffset={-15}
        enablePointLabel={true}
      />
    </div>
  );
});
