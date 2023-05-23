import Icons from "@/public/icons/icon";
import Image from "next/image";
import Tippy from "@tippyjs/react/headless";
import { FunctionComponent } from "react";
import Link from "next/link";

interface SearchProps {}
const styles = {
  titleSearch:'ml-2 font-medium text-dark2',
}
const Search: FunctionComponent<SearchProps> = () => {
  return (
    <Tippy
      interactive
      render={(attrs) => (
        <div className="z-50 box" tabIndex={-1} {...attrs}>
          <div className="bg-white w-[24vw] p-2 ml-[9px] rounded-lg shadow-2xl">
            <h2 className={styles.titleSearch}>COLLECTIONS</h2>
            <div className="">
              <Link href="/">
                <div className="flex items-center h-10 pl-1 rounded-md hover:bg-dark2">
                  <Image src={Icons.twitterIcon} alt="image search" />
                  <p className="ml-2 text-dark">ToCa.wft</p>
                </div>
              </Link>
              <Link href="/">
                <div className="flex items-center h-10 pl-1 rounded-md hover:bg-dark2">
                  <Image src={Icons.twitterIcon} alt="image search" />
                  <p className="ml-2 text-dark">ToCa.wft</p>
                </div>
              </Link>
            </div>
            <h2 className={styles.titleSearch}>ACCOUNTS</h2>
            <div className="">
              <Link href="/">
                <div className="flex items-center h-10 pl-1 rounded-md hover:bg-dark2">
                  <Image src={Icons.twitterIcon} alt="image search" />
                  <p className="ml-2 text-dark">ToCa.wft</p>
                </div>
              </Link>
              <Link href="/">
                <div className="flex items-center h-10 pl-1 rounded-md hover:bg-dark2">
                  <Image src={Icons.twitterIcon} alt="image search" />
                  <p className="ml-2 text-dark">ToCa.wft</p>
                </div>
              </Link>
            </div>
            <h2 className={styles.titleSearch}>ITEMS</h2>
            <div className="">
              <Link href="/">
                <div className="flex items-center h-10 pl-1 rounded-md hover:bg-dark2">
                  <Image src={Icons.twitterIcon} alt="image search" />
                  <p className="ml-2 text-dark">ToCa.wft</p>
                </div>
              </Link>
              <Link href="/">
                <div className="flex items-center h-10 pl-1 rounded-md hover:bg-dark2">
                  <Image src={Icons.twitterIcon} alt="image search" />
                  <p className="ml-2 text-dark">ToCa.wft</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    >
      <div className="relative flex items-center pl-3 search">
        <Image
          src={Icons.searchIcon}
          alt="search icon"
          className="absolute mx-2"
        />
        <input
          className="py-2 pl-10 border font-normal w-[20vw] text-sm h-8 rounded-full border-secondary2 text-secondary1 placeholder:text-secondary2 focus:outline-secondary1 3xl:w-[24vw] placeholder:font-normal"
          placeholder="Search items, collections, and accounts"
        ></input>
        <div className="absolute right-4">
          <Image
            className="absolute top-0 hidden w-4"
            src={Icons.noneaCancelBottom}
            alt="bottom search icon"
          ></Image>
          <Image
            className="w-4"
            src={Icons.noneaCancelRight}
            alt="right search icon"
          ></Image>
        </div>
      </div>
    </Tippy>
  );
};

export default Search;
