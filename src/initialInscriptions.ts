import { Inscription } from "@/inscription";

export const initialInscriptions = [
  {
    inscription: JSON.stringify({
      p: "lam",
      op: "call",
      contract: "proto",
      function: "mint",
      args: ["100000000"],
    } satisfies Inscription),
    sender: "walletA",
  },
  {
    inscription: JSON.stringify({
      p: "lam",
      op: "call",
      contract: "proto",
      function: "approve",
      args: ["move", "1"],
    } satisfies Inscription),
    sender: "walletA",
  },
  {
    inscription: JSON.stringify({
      p: "lam",
      op: "call",
      contract: "move",
      function: "moveFrom",
      args: ["walletA", "proto"],
    } satisfies Inscription),
    sender: "walletB",
  },
  /// CoinFlip intialize
  // walletB - Mint PUSD
  {
    inscription: JSON.stringify({
      p: "lam",
      op: "call",
      contract: "pusd",
      function: "mint",
      args: [12000000],
    } satisfies Inscription),
    sender: "walletB",
  },
  // walletB transfer to House and User
  {
    inscription: JSON.stringify({
      p: "lam",
      op: "call",
      contract: "pusd",
      function: "transfer",
      args: ["User", 50000],
    } satisfies Inscription),
    sender: "walletB",
  },
  {
    inscription: JSON.stringify({
      p: "lam",
      op: "call",
      contract: "pusd",
      function: "transfer",
      args: ["coinflip", 50000],
    } satisfies Inscription),
    sender: "walletB",
  },
  // User approve Pusd to spender CoinFlip contract
  {
    inscription: JSON.stringify({
      p: "lam",
      op: "call",
      contract: "pusd",
      function: "approve",
      args: ["coinflip", 50000],
    } satisfies Inscription),
    sender: "User",
  },
];
