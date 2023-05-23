import { useRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';
import React, { ReactNode } from 'react';
import type { Route } from 'next';

const styles = {
    active:'text-black'
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
const NavLink = ({ href, children }: Props) => {
    const router = useRouter()
  
    let className = children.props?.className || ''
    if (router.pathname === href) {
      className = `${className} ${styles.active}`;
    }
  
    return (
      <Link href={href} className={className}>
        <li>
          <p className={className}>{children}</p>
        </li>
      </Link>
    )
  }
export { ActiveLink, NavLink};
