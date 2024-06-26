"use client"

import NavBar from "@/components/nav-bar";
import { logger } from "@/lambda/global";

const Page = () => {
  return (
    <>
      <NavBar />
      <div className="flex flex-col gap-3 container m-8 mx-auto">
        {logger.readLogs().map((log) => (
          <div key={log.transactionHash} className="p-4 border rounded shadow">
            <h2 className="text-xl">{log.transactionHash}</h2>
            <p>{log.inscription}</p>
            {log.status === "SUCCESS" ? (
              <p>Success</p>
            ) : (
              <p>Error: {log.errorMessage}</p>
            )}
            {log.eventLogs.map((event, index) => (
              <p key={index}>
                {event.contract} {event.type}: {event.message}
              </p>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;
