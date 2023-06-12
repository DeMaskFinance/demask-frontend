import { useRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';
import React, { ReactNode } from 'react';
import type { Route } from 'next';

const styles = {
    active:'text-secondary1 after:block after:absolute after:-bottom-[17px] after:left-0 after:w-full after:h-[2px] after:bg-secondary1'
}
interface Props extends LinkProps {
  children: any;
  href:string | URL 
}

const ActiveLink = ({ href, children, ...props }: Props) => {
  const router = useRouter();
 
  let className = children.props.className || '';
  if (router.pathname === href) {
    className = `${className} ${styles.active}`;
  }

  return (
    <Link href={href} {...props}>
      {React.cloneElement(children as any, { className })}
    </Link>
  );
};

export default ActiveLink;
