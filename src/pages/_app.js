import Head from "next/head";
import "../../globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Nigahban Ramadan Package, CNIC Eligibility Checker</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
