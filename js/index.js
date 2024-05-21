Promise.all([
  d3.csv("data/china_map_test_data.csv"),
  d3.json("data/china_corrected_withprovinces_modified.json"),
]).then(([data, china]) => {
  const { nodes, links } = processData(data, china);
  

  const color = d3
    .scaleOrdinal()
    .domain(["outbound", "inbound"])
    .range(["#cbccfe", "#048ed6"]);

  const x = d3
    .scaleSqrt()
    .domain([1, d3.max(links, (d) => d.value)])
    .range([1, 24]);

  const dispatch = d3.dispatch(
    "locationchange",
    "directionchange",
    "displaychange"
  );

  const selected = {
    location: "110000",
    direction: "both",
    display: "top10",
  };

  new SelectControl({
    container: d3.select("#state-control"),
    label: "Focus Country",
    id: "state-select",
    options: nodes.map((d) => ({
      value: d.id,
      text: d.name,
    })),
    initialValue: selected.location,
    onChange: (location) => {
      dispatch.call("locationchange", null, location);
    },
  });

  new RadiosControl({
    container: d3.select("#direction-control"),
    label: "Flow Direction",
    name: "flow-direction-radio",
    options: [
      { value: "inbound", text: "Inbound", id: "flow-direction-inbound" },
      { value: "outbound", text: "Outbound", id: "flow-direction-outbound" },
      { value: "both", text: "Both", id: "flow-direction-both" },
    ],
    initialValue: selected.direction,
    onChange: (direction) => {
      dispatch.call("directionchange", null, direction);
    },
  });

  new RadiosControl({
    container: d3.select("#display-control"),
    label: "Displayed Flows",
    name: "flow-display-radio",
    options: [
      { value: "top10", text: "Top 10", id: "flow-display-top10" },
      { value: "all", text: "All", id: "flow-display-all" },
    ],
    initialValue: selected.display,
    onChange: (display) => {
      dispatch.call("displaychange", null, display);
    },
  });

  new FlowLegend({
    container: d3.select("#flow-legend"),
    color,
    x,
    flowValues: [1, 10, 20, 50], //可能要改
    tickValues: ["Outbound", "Inbound"],
  });

  const flowMap = new FlowMap({
    container: d3.select("#flow-map"),
    data: { nodes, links },
    location: selected.location,
    direction: selected.direction,
    display: selected.display,
    topo:china,
    color,
    x,
  });

  dispatch.on("locationchange", (location) => {
    selected.location = location;
    flowMap.onLocationChange(location);
  });

  dispatch.on("directionchange", (direction) => {
    selected.direction = direction;
    flowMap.onDirectionChange(direction);
  });

  dispatch.on("displaychange", (display) => {
    selected.display = display;
    flowMap.onDisplayChange(display);
  });
});

