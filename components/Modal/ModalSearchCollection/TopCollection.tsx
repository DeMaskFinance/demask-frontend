import SearchResultItem from "@/components/Search/SearchResultItem";
import AccountContext from "@/context/AccountContext";
import { topCollectionService } from "@/libs/service/collectionService";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useContext } from "react";
interface TopCollectionProps {
  handleFocus?: () => void;
}

const TopCollection: React.FC<TopCollectionProps> = ({ handleFocus }) => {
  const { chainId } = useContext(AccountContext);
  const { isLoading, data, isFetching, refetch, isPreviousData } = useQuery({
    queryKey: ["topNFT", chainId],
    queryFn: async () => {
      const res = await topCollectionService(chainId);
      return res.data;
    },

    keepPreviousData: true,
  });

  return (
    <Fragment>
      {data && data.length > 0 ? (
        <div>
          <p className="ml-2 text-sm font-semibold text-primary_400 my-2">
            Top Collections
          </p>
          <div className="block mb-2 max-h-[300px] ">
            {data.map((item: any, index: number) => (
              <SearchResultItem
                key={index}
                item={item}
                type="collection"
                handleFocus={handleFocus}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {isFetching ? (
            <div className="bg-slate-700  animate-pulse h-[24px] w-full rounded-lg px-3"></div>
          ) : (
            <span className="text-base text-primary_400"></span>
          )}
        </>
      )}
    </Fragment>
  );
};

export default TopCollection;
