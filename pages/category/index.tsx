import Head from "next/head";
import Image from "next/image";
import CategoryType from "@/components/Categories/CategoryType";

export default function Categories() {
  return (
    <>
      <Head>
        <title>Category | DeMask</title>
      </Head>
      {/* 123o */}

      <div className="max-w-6xl pt-2 pb-16 mx-auto">
        <CategoryType label={"Art"} />
        <CategoryType label={"Gaming"} />
        <CategoryType label={"Film"} />
        <CategoryType label={"Music"} />
        <CategoryType label={"Memberships"} />
        <CategoryType label={"Others"} />
      </div>
    </>
  );
}
