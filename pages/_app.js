import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={roboto.className}>
      <Component {...pageProps} />
    </main>
  );
}
