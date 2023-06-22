import { Button } from "@/components/Buttons";
import { PoolIcon } from "@/components/Icons";
import images from "@/public/images";
import Head from "next/head";
import Image from "next/image";
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-full py-2 pl-2 mb-6 border rounded-lg border-dark3 block",
  btnActive: "rounded-full bg-base2",
};
const Swap: React.FC = () => {
  return (
    <div className="py-8 swap">
      <Head>
        <title>Swap | DeMask</title>
      </Head>
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-medium text-dark0">
          Face to Face (FaToCe)
        </h3>
        <p className="text-sm font-medium text-dark1">ToCa.ETH</p>
      </div>
      <div className="flex gap-x-10">
        <div className="w-[50%]">
          <Image
            src={images.testImg}
            alt="test"
            className=""
          />
        </div>
        <div className="w-[50%]">
          <div className="px-4 py-6 border rounded-lg border-dark3">
            <div className="flex justify-between mb-6 text-dark1">
              <div>
                <div>1231</div>
                <p>Balance: 10,000</p>
              </div>
              <div>BUY</div>
              <div className="flex text-dark2">
                <PoolIcon width={26} height={26} />
                <p>Pool</p>
              </div>
            </div>
            <form action="submit">
              <input
                type="number"
                name="token"
                id="token"
                placeholder="Input amount token"
                className={styles.inputItem}
              />
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder="Input amount NFT"
                className={styles.inputItem}
              />
              <div className="flex justify-center w-full">
                <Button type="submit" className="p-2" primary>
                  BUY NFT
                </Button>
              </div>
            </form>
          </div>
          <div className="px-4 py-6 mt-6 border rounded-lg border-dark3">
            <div className="mb-12">
              <ul>
                <li className="text-dark3">Volume and Price</li>
                <li className="text-dark1">1.2997 ETH</li>
                <li className="text-dark2">Avg.Pice: 0.0762 ETH</li>
                <li className="text-dark3">7:00 Am, may 17, 2023 (UTC)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
