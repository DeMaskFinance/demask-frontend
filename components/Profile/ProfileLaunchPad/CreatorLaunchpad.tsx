import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoReloadOutline } from "react-icons/io5";
import { CountdownTime } from "./CardLaunchpad";
import ModalAddAdminLaunchpad from "@/components/Modal/ModalLaunchpadProfile/ModalAddAdminLaunchpad";

export default function CreatorLaunchpad({ tab }: any) {
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);

  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [addressUser, setAddressUser] = useState<string>("");
  const [amountLeave, setAmountLeave] = useState(0);
  const [tokenLaunchpad, setTokenLaunchpad] = useState("");

  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: ["creator",account,chainId],
    queryFn: async () => {
      const res = await categoryAPI(
        `/userCreatedLaunchpad?userAddress=${account}&chainId=${chainId}&page=1&limit=50`
      );
      return res;
    },

    refetchInterval: 60000,
  });

  console.log(data);

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <h2 className="flex items-baseline">
          Total (
          {!isLoading ? (
            data?.launchpadLists?.length || 0
          ) : (
            <BiLoader className="animate-spin" />
          )}
          )
        </h2>

        <button
          onClick={() => {
            refetch();
          }}
          className="flex items-center gap-2 px-2 py-1 text-white border rounded-lg bg-secondary3 hover:bg-secondary5"
        >
          <IoReloadOutline /> Refetch
        </button>
      </div>

      <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 overflow-hiddene">
        {data?.launchpadLists?.map((item: any) => (
          <>
            {
              <div className="relative max-w-sm overflow-hidden bg-gray-800 rounded-b-lg">
                <Link
                  className="overflow-hidden transition-all h-52 group"
                  href={`launchpad/${item.nftID}/${process.env.NEXT_PUBLIC_CREATOR}/${item.tokenPayment}`}
                >
                  <Image
                    className="relative z-0 object-cover w-full transition-all scale-105 h-52 group-hover:scale-110"
                    src={item.metadata?.image}
                    alt=""
                    width={600}
                    height={600}
                  />
                </Link>
                <div className="relative z-40 flex items-center justify-between px-5 pt-4 pb-2 overflow-hidden">
                  <Link
                    href={`launchpad/${item.nftID}/${process.env.NEXT_PUBLIC_CREATOR}/${item.tokenPayment}`}
                  >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 hover:text-secondary5 dark:text-white">
                      {item.metadata?.name}
                    </h5>
                  </Link>
                </div>
                <CountdownTime blockNumber={item.endTime} />
                <div className="flex justify-between px-5 pb-4">
                  <button
                    onClick={() => {
                      setIsOpenModal(true);
                      setTokenLaunchpad(item.launchpad);
                    }}
                    className={`
                         text-red border border-red hover:border-secondary5 hover:text-secondary5
                     px-2 py-1 rounded-lg transition-all`}
                  >
                    Add Admin
                  </button>
                </div>
                {/* <span className="text-white absolute top-0 min-w-[32px] text-center text-sm block bg-secondary4 px-2 py-2 rounded-b-full">
                  {isRefetching ? (
                    <BiLoader className="animate-spin" />
                  ) : (
                    item.amount
                  )}
                </span> */}
              </div>
            }
          </>
        ))}
      </div>

      <ModalAddAdminLaunchpad
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        tokenLaunchpad={tokenLaunchpad}
        action="addAdmin"
      />
    </>
  );
}
