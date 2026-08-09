import css from "./ScreenBlock.module.css";
import Image from "next/image";

export default function ScreenBlock() {
  return (
    <div className={css.screenBlock}>
        <Image
          src="/images/tel.png"
          alt="Smartphone mockup displaying the mobile application interface with recommended books"
          width={255}
          height={315}
          className={css.telImage}
        />
        <Image
          src="/images/desk.png"
          alt="Desktop interface preview of the application library"
          width={405}
          height={520}
          className={css.deskImage}
        />
    </div>
  );
}
