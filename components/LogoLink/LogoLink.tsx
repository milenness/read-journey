import Link from 'next/link';
import Image from "next/image";
import css from './LogoLink.module.css';


export default function LogoLink() {
  return (
    <Link href="/" className={css.logoLink}>
      <Image
        src="/images/logo.svg"
        alt="Logo"
        width={42}
        height={17}
        className={css.logoImage}
      />
     <span className={css.logoText}>read journey</span>
    </Link>
  );
}