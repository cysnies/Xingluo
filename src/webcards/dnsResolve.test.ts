import { afterEach, describe, expect, it, vi } from "vitest";

const lookup = vi.fn();

vi.mock("node:dns/promises", () => ({
  lookup: (...args: unknown[]) => lookup(...args),
}));

import { isSafeResolvedHostname } from "./http";

afterEach(() => {
  lookup.mockReset();
});

describe("isSafeResolvedHostname", () => {
  it("rejects private literal IPs without DNS", async () => {
    await expect(isSafeResolvedHostname("127.0.0.1")).resolves.toBe(false);
    await expect(isSafeResolvedHostname("10.0.0.2")).resolves.toBe(false);
    expect(lookup).not.toHaveBeenCalled();
  });

  it("allows hostnames that resolve only to public IPs", async () => {
    lookup.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
    await expect(isSafeResolvedHostname("example.com")).resolves.toBe(true);
  });

  it("rejects hostnames that resolve to a private IP", async () => {
    lookup.mockResolvedValue([
      { address: "8.8.8.8", family: 4 },
      { address: "192.168.1.10", family: 4 },
    ]);
    await expect(isSafeResolvedHostname("evil.example")).resolves.toBe(false);
  });

  it("rejects when DNS fails", async () => {
    lookup.mockRejectedValue(new Error("ENOTFOUND"));
    await expect(isSafeResolvedHostname("no.such.host")).resolves.toBe(false);
  });
});
