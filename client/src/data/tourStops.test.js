import { getTourStops } from "./tourStops";

test("tour keeps evidence order and merges the two Jio roles", () => {
  expect(getTourStops([{ id: "experience-2" }, { id: "experience-1" }, { id: "project-cloud" }]).map(s => s.id)).toEqual(["jio", "cloud"]);
});
test("unknown sources cannot become navigation destinations", () => {
  expect(getTourStops([{ id: "https://example.com" }, { id: "project-__proto__" }, { id: "constructor" }])).toEqual([]);
  expect(getTourStops([])).toEqual([]);
});
