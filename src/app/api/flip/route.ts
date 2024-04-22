import { NextRequest, NextResponse } from "next/server";
import keccak256 from "keccak256";
import { bigIntJson } from "@/lib/big-int";

export async function POST(request: NextRequest) {
  const { seed, sender } = await request.json();
  const hostSeed = BigInt(
    "0x" +
      keccak256(seed + Math.floor(10000000 * Math.random())).toString("hex")
  );

  return new NextResponse(bigIntJson.stringify({ hostSeed }));
}
