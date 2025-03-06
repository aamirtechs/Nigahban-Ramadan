import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
		<title>Nigahban Ramadan Package 2025</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
