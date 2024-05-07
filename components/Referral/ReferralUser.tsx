import React, { useContext } from "react";
import { Button } from "../Buttons";
import { TickSuccessIcon } from "../Icons";
import Copy from "../Common/Copy";
import { useQuery } from "@tanstack/react-query";
import { referralInfor } from "@/libs/service/referralService";
import AccountContext from "@/context/AccountContext";

const ReferralUser = () => {
  const { account } = useContext(AccountContext);
  const { data, isLoading } = useQuery({
    queryKey: ["ReferralInfor", account],
    queryFn: async () => {
      const res = await referralInfor(account);
      return res.data;
    },
  });
  console.log(data);

  return (
    <div>
      {account && (
        <div className="p-6 border rounded-lg border-dark4 area_darkBG1">
          {/* <div className="flex justify-between w-full px-4 py-2 mb-6 font-semibold text-white bg-opacity-50 rounded-lg bg-green ">
      <div>
        <p>Referral status</p>
      </div>
      <p>Active</p>
    </div> */}
          <p>Referral link</p>
          <div className="flex mt-2 mb-4 gap-x-2">
            <p className="flex items-center w-full px-4 py-2 font-semibold rounded-lg gap-x-2 area_input text-dark2 bg-dark4 dark:bg-darkBG2">
              https://test.demask.finance/invite?code={data?.referralCode}
              <Copy
                content={`https://test.demask.finance/invite?code=${data?.referralCode}`}
              />
            </p>
          </div>
          <p>Accept a Referral</p>
          <div className="flex mt-2 gap-x-2">
            <div className="flex w-full px-4 py-2 font-semibold rounded-lg area_input text-dark2 bg-dark4 dark:bg-darkBG2 gap-x-2">
              {data?.referredBy ? (
                <div>
                  <span>
                    <TickSuccessIcon
                      width={20}
                      height={20}
                      className="fill-green"
                    />
                  </span>
                  You're in! Referred by{" "}
                  <span className="text-secondary5"> {data?.referredBy}</span>
                </div>
              ) : (
                <span>You haven't a referral</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralUser;
