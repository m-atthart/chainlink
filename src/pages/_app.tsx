import type { AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { api } from "../utils/trpc";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<ClerkProvider {...pageProps}>
				<Component {...pageProps} />
			</ClerkProvider>
			<Analytics />
		</>
	);
};

export default api.withTRPC(MyApp);
