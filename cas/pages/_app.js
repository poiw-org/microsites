import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.scss'
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import * as Sentry from '@sentry/browser';
import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: "https://7fd410f5921c46b5a9af7d86a6bc9d67@o350531.ingest.sentry.io/5528008",
  tracesSampleRate: 1.0,
})

function CAS({ Component, pageProps }) {
  return <Component {...pageProps} />
}
export default CAS
