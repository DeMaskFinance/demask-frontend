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

      <div className="pb-16">
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
