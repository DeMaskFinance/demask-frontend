import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

interface Props extends LinkProps {
  children: any;
  href: string;
}

const ActiveLink = ({ href, children, ...props }: Props) => {
  const router = useRouter();

  let className = children.props.className || "";

  if (router.asPath.includes(href.split("?")[0])) {
    className = `${className} text-primary_300 text-shadow-sm shadow-primary_500`;
  }

  return (
    <Link href={href} {...props}>
      {React.cloneElement(children as any, { className })}
    </Link>
  );
};

export default ActiveLink;
