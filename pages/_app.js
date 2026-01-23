import { Roboto } from "next/font/google";
import { SWRConfig } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

const roboto = Roboto({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <main className={roboto.className}>
        <Component {...pageProps} />
      </main>
    </SWRConfig>
  );
}
