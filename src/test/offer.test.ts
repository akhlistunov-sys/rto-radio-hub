import { describe, it, expect } from "vitest";
import { listPrice } from "@/lib/offer";

describe("offer list price (calculator tariffs, 20s spot)", () => {
  it("2 stations, 10 spots, 30 days at 1.5 ₽/s", () => {
    expect(listPrice(2, 10, 30)).toBe(18000);
  });
  it("6 stations at 1.1 ₽/s", () => {
    expect(listPrice(6, 5, 15)).toBe(9900);
  });
  it("15 spots gets 5% discount", () => {
    expect(listPrice(1, 15, 30)).toBe(12825);
  });
});
