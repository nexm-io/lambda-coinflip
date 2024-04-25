import { persistenceStorage } from "@/persistenceStorage";
import { stringify } from "superjson";
import { Contract } from "@/contracts/types/contract";
import { createStrippedState } from "@/lib/stripped-contract-state";
import NavBar from "@/components/nav-bar";

export const dynamic = "force-dynamic";

const Page = () => {
  const toString = (contract: Contract) => {
    return stringify(createStrippedState(contract));
  };

  return (
    <>
      <NavBar />
      <div className="max-w-full container m-8 mx-auto">
        {Object.entries(persistenceStorage).map(([name, state]) => (
          <div key={name}>
            <h3 className="text-lg">{name}</h3>
            <pre>{toString(state)}</pre>
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;
