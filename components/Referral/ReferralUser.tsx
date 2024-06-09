import AccountContext from "@/context/AccountContext";
import { referralInfor } from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { MdDone } from "react-icons/md";
import Copy from "../Common/Copy";

const ReferralUser = () => {
  const { account } = useContext(AccountContext);
  const { data, isLoading } = useQuery({
    queryKey: ["ReferralInfor", account],
    queryFn: async () => {
      const res = await referralInfor(account);
      return res.data;
    },
    enabled: !!account,
  });

  return (
    <div>
      {account && (
        <div className="p-4 bg-shader_800 border border-shader_500 rounded-lg text-shader_200 text-sm">
          {/* <div className="flex justify-between w-full px-4 py-2 mb-6 font-semibold text-white bg-opacity-50 rounded-lg bg-green ">
      <div>
        <p>Referral status</p>
      </div>
      <p>Active</p>
    </div> */}
          <p>Referral link</p>
          <div className="flex mt-1 mb-4 gap-x-2">
            <div className="flex items-center w-full px-3 py-2 font-semibold rounded-lg whitespace-nowrap bg-shader_600 flex-nowrap gap-x-2 border-shader_500  ">
              <span className="">
                https://test.demask.finance/invite?code={data?.referralCode}
              </span>

              <Copy
                content={`https://test.demask.finance/invite?code=${data?.referralCode}`}
              />
            </div>
          </div>
          <p>Accept a Referral</p>
          <div className="flex mt-1 gap-x-2">
            <div className="flex w-full px-4 py-2 font-semibold rounded-lg  border-shader_700  gap-x-2">
              {data?.referredByAddress ? (
                <div className="flex items-center gap-x-2">
                  <MdDone className="text-green" /> You're in! Referred by{" "}
                  <span className="text-primary_400">
                    {`${data?.referredByAddress.slice(
                      0,
                      3
                    )}...${data?.referredByAddress.slice(-6)}`}
                  </span>
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
