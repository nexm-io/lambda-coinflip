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

function CoinFlip() {
  const [betAmount, setBetAmount] = useState<number>(0);
  const [isHead, setIsHead] = useState<boolean | undefined>(undefined);
  const [isWin, setIsWin] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

        console.log(
          seed,
          response.hostSeed,
          response.hostSeed[response.hostSeed.length - 1]
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
            toast.success("flipped");
          });
      });
  };

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: { betAmount: 0, isHead: false },
  });
  return (
    <main>
      <div className="grid gap-4 max-w-[600px] mx-auto">
        <h3 className="text-3xl text-center font-bold">LAMBDA FLIP</h3>
        {isLoading ? (
          <>
            <Loading />
            <p className="text-xl text-center font-bold text-gray-500">FLIPPING</p>
            <p className="text-xl font-bold text-center text-gray-500">
              {`${isHead ? "HEADS" : "TAILS"} FOR ${betAmount} PUSD`}
            </p>
          </>
        ) : (
          <>
            <img src="/coin.png" alt="" className="mx-auto w-[150px]" />
            {isWin === undefined ? (
              <>
                <p className="text-gray-500 text-center text-xl font-bold">
                  I LIKE
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={cn(
                      `text-center border-2 border-b-[4px] border-r-[4px] border-black text-black font-bold transition-all hover:bg-black hover:text-white cursor-pointer py-4`,
                      {
                        "bg-black text-white":
                          isHead !== undefined && isHead === true,
                      }
                    )}
                    onClick={() => setIsHead(true)}
                  >
                    HEADS
                  </button>
                  <button
                    className={cn(
                      `text-center border-2 border-b-[4px] border-r-[4px] border-black text-black font-bold transition-all hover:bg-black hover:text-white cursor-pointer py-4`,
                      {
                        "bg-black text-white":
                          isHead !== undefined && isHead === false,
                      }
                    )}
                    onClick={() => setIsHead(false)}
                  >
                    TAILS
                  </button>
                </div>
                <p className="text-gray-500 text-center text-xl font-bold">
                  FOR
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {BET_PRICE.map((z, i) => (
                    <button
                      key={i}
                      className={cn(
                        `text-center border-2 border-b-[4px] border-r-[4px] border-black text-black font-bold transition-all hover:bg-black hover:text-white cursor-pointer py-1`,
                        {
                          "bg-black text-white": betAmount === z,
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
                    `text-center border-2 border-b-[4px] border-r-[4px] border-black text-black font-bold transition-all hover:bg-black hover:text-white cursor-pointer py-4`
                  )}
                  onClick={() => onSubmit({ betAmount, isHead: isHead as any })}
                >
                  DOUBLE OR NOTHING
                </button>
              </>
            ) : isWin === true ? (
              <>
                <p className="text-xl text-center font-bold text-gray-500">YOU WIN</p>
                <p className="text-xl text-green-300 font-bold text-center">
                  {betAmount} PUSD
                </p>

                <button
                  className={cn(
                    `text-center border-2 border-b-[4px] border-r-[4px] border-black text-black font-bold transition-all hover:bg-black hover:text-white cursor-pointer py-4`
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
                <p className="text-xl text-center font-bold text-gray-500">YOU LOSE</p>
                <p className="text-xl text-red-400 font-bold text-center">
                  {betAmount} PUSD
                </p>
                <button
                  className={cn(
                    `text-center border-2 border-b-[4px] border-r-[4px] border-black text-black font-bold transition-all hover:bg-black hover:text-white cursor-pointer py-4`
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
  return (
    <main>
      <section className="overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 p-4"
        >
          <div className="flex gap-2 items-end">
            <div className="flex-grow">
              <Label>BetAmount</Label>
              <Input {...register("betAmount", { required: true })} />
            </div>
            <div className="flex-grow">
              <input
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                type="checkbox"
                role="switch"
                id="selection"
                {...register("isHead")}
              />
              <label
                className="inline-block pl-[0.15rem] hover:cursor-pointer"
                htmlFor="selection"
              >
                {getValues("isHead") ? "Head" : "Tail"}
              </label>
            </div>
            <Button>Flip</Button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CoinFlip;
