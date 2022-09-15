import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

// https://github.com/remix-run/remix/issues/2570
hydrate(<RemixBrowser />, document);
