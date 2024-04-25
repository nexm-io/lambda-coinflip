"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiWrapper } from "@/lib/api-wrapper";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const BET_PRICE = [1, 2, 3, 4, 5, 6];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const Loading = () => {
  return (
    <>
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <Image
              src="/coin.png"
              alt="soby"
              width={150}
              height={150}
              className="mx-auto"
            />
          </div>
          <div className="flip-card-back">
            <Image
              src="/coin.png"
              alt="soby"
              width={150}
              height={150}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const Head = () => {
  return (
    <div className="w-[30px] aspect-square rounded-full border-[4px] border-orange-400 flex justify-center items-center text-orange-400 font-bold">
      H
    </div>
  );
};

const Tail = () => {
  return (
    <div className="w-[30px] aspect-square rounded-full border-[4px] border-gray-400 flex justify-center items-center text-gray-400 font-bold">
      T
    </div>
  );
};

function CoinFlip() {
  const [betAmount, setBetAmount] = useState<number>(0);
  const [isHead, setIsHead] = useState<boolean | undefined>(undefined);
  const [isWin, setIsWin] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestFlip, setLatestFlip] = useState<number[]>([
    1, 2, 3, 2, 3, 4, 5, 6, 2, 3, 4, 5, 3, 5, 3, 2, 5, 6,
  ]);
  const [headPercent, setHeadPercent] = useState<number>(48);

  const onSubmit = async (data: { betAmount: number; isHead: boolean }) => {
    setIsLoading(true);
    await sleep(1500);
    const block = Math.random();

    apiWrapper
      .inscribe(
        `{ "p": "lam", "op": "call", "contract": "coinflip", "function": "flip", "args": [ ${data.betAmount} ] }`,
        "User", // wallet
        block
      )
      .then(async () => {
        // random seed change based on user selection
        const seed =
          Math.floor(10000000 * Math.random()) ^ (data.isHead ? 0 : 1);
        const response = await apiWrapper.flip(
          seed,
          "User" // wallet
        );

        const isWin =
          (seed % Number(response.hostSeed[response.hostSeed.length - 1])) %
            2 ===
          0;

        apiWrapper
          .inscribe(
            `{ "p": "lam", "op": "call", "contract": "coinflip", "function": "claim", "args": [ ${seed}, ${response.hostSeed} ] }`,
            "User", // wallet
            block + 10
          )
          .then(() => {
            setIsLoading(false);
            setIsWin(isWin);
            setLatestFlip([
              isWin ? (isHead ? 2 : 1) : isHead ? 1 : 2,
              ...latestFlip,
            ]);
            setHeadPercent(
              headPercent + (isWin ? (isHead ? 1 : -1) : isHead ? -1 : +1)
            );
            toast.success("flipped");
          });
      });
  };

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: { betAmount: 0, isHead: false },
  });
  return (
    <main className="bg-[#0C2026] pb-20 min-h-screen">
      <div className="bg-[#2C4952] py-2">
        <div className="flex items-center justify-between container gap-6">
          <div className="flex gap-2">
            <div className="flex gap-1">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.46447 15.4645C2.40215 14.5268 3.67392 14 5 14H13C14.3261 14 15.5979 14.5268 16.5355 15.4645C17.4732 16.4021 18 17.6739 18 19V21C18 21.5523 17.5523 22 17 22C16.4477 22 16 21.5523 16 21V19C16 18.2044 15.6839 17.4413 15.1213 16.8787C14.5587 16.3161 13.7956 16 13 16H5C4.20435 16 3.44129 16.3161 2.87868 16.8787C2.31607 17.4413 2 18.2044 2 19V21C2 21.5523 1.55228 22 1 22C0.447715 22 0 21.5523 0 21V19C0 17.6739 0.526784 16.4021 1.46447 15.4645Z"
                    fill="inherit"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 4C7.34315 4 6 5.34315 6 7C6 8.65685 7.34315 10 9 10C10.6569 10 12 8.65685 12 7C12 5.34315 10.6569 4 9 4ZM4 7C4 4.23858 6.23858 2 9 2C11.7614 2 14 4.23858 14 7C14 9.76142 11.7614 12 9 12C6.23858 12 4 9.76142 4 7Z"
                    fill="inherit"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.0318 14.88C19.1698 14.3453 19.7153 14.0237 20.25 14.1618C21.3227 14.4387 22.273 15.0641 22.9517 15.9397C23.6304 16.8152 23.9992 17.8914 24 18.9993L24 21C24 21.5523 23.5523 22 23 22C22.4477 22 22 21.5523 22 21L22 19.0007C22 19.0006 22 19.0008 22 19.0007C21.9994 18.3361 21.7782 17.6902 21.371 17.165C20.9638 16.6396 20.3936 16.2644 19.75 16.0982C19.2153 15.9602 18.8937 15.4148 19.0318 14.88Z"
                    fill="inherit"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.0312 2.88196C15.1682 2.34694 15.713 2.02426 16.248 2.16125C17.3236 2.43663 18.2768 3.06213 18.9576 3.93914C19.6383 4.81615 20.0078 5.89479 20.0078 7.005C20.0078 8.11521 19.6383 9.19385 18.9576 10.0709C18.2768 10.9479 17.3236 11.5734 16.248 11.8488C15.713 11.9857 15.1682 11.6631 15.0312 11.128C14.8943 10.593 15.2169 10.0482 15.752 9.91125C16.3973 9.74603 16.9692 9.37073 17.3777 8.84452C17.7861 8.31831 18.0078 7.67113 18.0078 7.005C18.0078 6.33887 17.7861 5.69169 17.3777 5.16548C16.9692 4.63928 16.3973 4.26398 15.752 4.09875C15.2169 3.96176 14.8943 3.41699 15.0312 2.88196Z"
                    fill="inherit"
                  />
                </svg>
                <p className="text-white text-sm">100,202</p>
              </div>

              <sub className="text-orange-400">FLIPPING</sub>
            </div>
            <div className="flex gap-1">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.3861 1.21065C11.7472 0.929784 12.2528 0.929784 12.6139 1.21065L21.6139 8.21065C21.8575 8.4001 22 8.69141 22 9V20C22 20.7957 21.6839 21.5587 21.1213 22.1213C20.5587 22.6839 19.7957 23 19 23H5C4.20435 23 3.44129 22.6839 2.87868 22.1213C2.31607 21.5587 2 20.7957 2 20V9C2 8.69141 2.14247 8.4001 2.38606 8.21065L11.3861 1.21065ZM4 9.48908V20C4 20.2652 4.10536 20.5196 4.29289 20.7071C4.48043 20.8946 4.73478 21 5 21H19C19.2652 21 19.5196 20.8946 19.7071 20.7071C19.8946 20.5196 20 20.2652 20 20V9.48908L12 3.26686L4 9.48908Z"
                    fill="inherit"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 12C8 11.4477 8.44772 11 9 11H15C15.5523 11 16 11.4477 16 12V22C16 22.5523 15.5523 23 15 23C14.4477 23 14 22.5523 14 22V13H10V22C10 22.5523 9.55228 23 9 23C8.44772 23 8 22.5523 8 22V12Z"
                    fill="inherit"
                  />
                </svg>
                <p className="text-white text-sm">1,213</p>
              </div>

              <sub className="text-orange-400">PUSD</sub>
            </div>
          </div>

          <div className="flex gap-1 items-center">
            <div className="grid grid-flow-col gap-1 justify-end overflow-hidden">
              {latestFlip.map((z, i) =>
                z % 2 === 0 ? <Head key={i} /> : <Tail key={i} />
              )}
            </div>
            <div className="h-[20px] flex items-center w-[400px]">
              <div
                className="h-[20px] bg-gray-400 text-xs flex justify-center items-center text-white"
                style={{
                  width: `${headPercent}%`,
                }}
              >
                HEADS {headPercent}%
              </div>
              <div
                className="h-[20px] bg-orange-400 text-xs flex justify-center items-center text-white"
                style={{
                  width: `${100 - headPercent}%`,
                }}
              >
                TAILS {100 - headPercent}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 text-white px-20 pt-4">
        <Link href="/">Home</Link>
        <Link href="/transactions">Transactions</Link>
      </div>
      <div className="grid gap-4 max-w-[600px] mx-auto mt-10">
        <h3 className="text-3xl text-center font-bold text-white">
          LAMBDA FLIP
        </h3>

        {isLoading ? (
          <>
            <Loading />
            <p className="text-xl text-center font-bold text-gray-500">
              FLIPPING
            </p>
            <p className="text-xl font-bold text-center text-gray-500">
              {`${isHead ? "HEADS" : "TAILS"} FOR ${betAmount} PUSD`}
            </p>
          </>
        ) : (
          <>
            <img src="/coin.png" alt="" className="mx-auto w-[150px]" />
            {isWin === undefined ? (
              <>
                <p className="text-white text-center text-xl font-bold">
                  I LIKE
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={cn(
                      `text-center border-2 border-b-[4px] border-r-[4px] border-orange-400 text-white bg-orange-300 font-bold transition-all hover:bg-orange-400 hover:text-white cursor-pointer py-4`,
                      {
                        "border-white bg-orange-400":
                          isHead !== undefined && isHead === true,
                      }
                    )}
                    onClick={() => setIsHead(true)}
                  >
                    HEADS
                  </button>
                  <button
                    className={cn(
                      `text-center border-2 border-b-[4px] border-r-[4px] border-orange-400 text-white bg-orange-300 font-bold transition-all hover:bg-orange-400 hover:text-white cursor-pointer py-4`,
                      {
                        "border-white bg-orange-400":
                          isHead !== undefined && isHead === false,
                      }
                    )}
                    onClick={() => setIsHead(false)}
                  >
                    TAILS
                  </button>
                </div>
                <p className="text-white text-center text-xl font-bold">FOR</p>
                <div className="grid grid-cols-3 gap-4">
                  {BET_PRICE.map((z, i) => (
                    <button
                      key={i}
                      className={cn(
                        `text-center border-2 border-b-[4px] border-r-[4px] border-orange-400 text-white bg-orange-300 font-bold transition-all hover:bg-orange-400 hover:text-white cursor-pointer py-1`,
                        {
                          "border-white bg-orange-400": betAmount === z,
                        }
                      )}
                      onClick={() => {
                        setBetAmount(z);
                      }}
                    >
                      {z} PUSD
                    </button>
                  ))}
                </div>
                <button
                  className={cn(
                    `text-center border-2 border-b-[4px] border-r-[4px] border-orange-400 text-white bg-orange-300 font-bold transition-all hover:bg-orange-400 hover:text-white cursor-pointer py-4`,
                    {}
                  )}
                  onClick={() => onSubmit({ betAmount, isHead: isHead as any })}
                >
                  DOUBLE OR NOTHING
                </button>
              </>
            ) : isWin === true ? (
              <>
                <p className="text-xl text-center font-bold text-white">
                  YOU WIN
                </p>
                <p className="text-xl text-green-300 font-bold text-center">
                  {betAmount} PUSD
                </p>

                <button
                  className={cn(
                    `text-center border-2 border-b-[4px] border-r-[4px] border-orange-400 text-white bg-orange-300 font-bold transition-all hover:bg-orange-400 hover:text-white cursor-pointer py-4`,
                    {}
                  )}
                  onClick={() => {
                    setBetAmount(0);
                    setIsHead(undefined);
                    setIsWin(undefined);
                  }}
                >
                  CONTINUE
                </button>
              </>
            ) : (
              <>
                <p className="text-xl text-center font-bold text-white">
                  YOU LOSE
                </p>
                <p className="text-xl text-red-400 font-bold text-center">
                  {betAmount} PUSD
                </p>
                <button
                  className={cn(
                    `text-center border-2 border-b-[4px] border-r-[4px] border-orange-400 text-white bg-orange-300 font-bold transition-all hover:bg-orange-400 hover:text-white cursor-pointer py-4`,
                    {}
                  )}
                  onClick={() => {
                    setBetAmount(0);
                    setIsHead(undefined);
                    setIsWin(undefined);
                  }}
                >
                  TRY AGAIN
                </button>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default CoinFlip;
