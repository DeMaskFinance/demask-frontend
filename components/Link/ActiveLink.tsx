import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

const styles = {
  active: "text-primary_300",
};
interface Props extends LinkProps {
  children: any;
  href: string;
}

const ActiveLink = ({ href, children, ...props }: Props) => {
  const router = useRouter();

  let className = children.props.className || "";

  if (router.asPath.includes(href.split("?")[0])) {
    className = `${className} ${styles.active}`;
  }

  return (
    <Link href={href} {...props}>
      {React.cloneElement(children as any, { className })}
    </Link>
  );
};

export default ActiveLink;
