// import Link from "next/link";
// import { useRouter } from "next/router";

// export default const NavLink = ({ href, children }: Props) => {
//     const router = useRouter()
  
//     let className = children.props?.className || ''
//     if (router.pathname === href) {
//       className = `${className} ${styles.active}`;
//     }
  
//     return (
//       <Link href={href} className={className}>
//         <li>
//           <p className={className}>{children}</p>
//         </li>
//       </Link>
//     )
//   }