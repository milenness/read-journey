import css from "./ScreenBlock.module.css";
import Image from "next/image";
import telImage from "@/public/images/tel.png";
import deskImage from "@/public/images/desk.png";

export default function ScreenBlock() {
  return (
    <div className={css.screenBlock}>
      <Image
        src={telImage}
        alt="Smartphone mockup displaying the mobile application interface with recommended books"
        className={css.telImage}
        loading="eager"
      />
      <Image
        src={deskImage}
        alt="Desktop interface preview of the application library"
        className={css.deskImage}
        loading="eager"
      />
    </div>
  );
}
