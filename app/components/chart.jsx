import { ResponsiveLine } from "@nivo/line";
import { Box } from "@mui/material";

export default function Chart({ data }) {
    const handicaps = data.map(v => v.y);
  return (
    <Box height={400} my={4} bgcolor="white" borderRadius={2}>
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
          min: handicaps.reduce((acc,v) => Math.min(acc, v)) - 0.2,
          max: handicaps.reduce((acc,v) => Math.max(acc, v)) + 0.2
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
        }}
        colors={{ scheme: "category10" }}
        axisBottom={{
          format: (date) =>
            date.toLocaleDateString("es-AR", { month: "long", day: "numeric" }),
          tickValues: "every 7 days",
          tickPadding: 12
        }}
        layers={["grid", "axes", "points", "lines"]}
        pointSize={16}
        pointLabelYOffset={-15}
        enablePointLabel={true}
      />
    </Box>
  );
}
