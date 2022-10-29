import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "../styles/sidebar.css";
import "../styles/dashboard.css";
import type { AppProps } from "next/app";
import { SSRProvider } from "react-bootstrap";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      {" "}
      <Component {...pageProps} />
    </SSRProvider>
  );
}

export default MyApp;
