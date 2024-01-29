import { redirect } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

import { AddLinkk } from "../_components/add-linkk";
import { Linkk } from "../_components/linkk";

export default async function Chain({ params }: { params: { user: string } }) {
	const session = await getServerAuthSession();
	const sessionUser = session?.user;
	const queryUser = params.user;
	console.log(queryUser);
	if (queryUser === "me") {
		if (!sessionUser) redirect("/api/auth/signin");
		else redirect(`/${sessionUser.name}`);
	}

	const chain = await api.linkk.getChain.query({
		username: queryUser ?? "",
	});

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-start gap-8 bg-gradient-to-br from-gradient-start to-gradient-end">
			<header className="flex w-full items-center justify-end p-8">
				<div className="m-2 flex h-12 w-36 items-center justify-center bg-slate-600 text-white">
					<p>Hello {sessionUser?.name}</p>
				</div>
				<Link
					href={sessionUser ? "/api/auth/signout" : "/api/auth/signin"}
					className="flex h-12 w-36 items-center justify-center bg-slate-600 text-white"
				>
					{sessionUser ? "Sign Out" : "Sign In"}
				</Link>
			</header>
			{sessionUser && queryUser === sessionUser.name && <AddLinkk />}
			<div className="flex w-full max-w-screen-xl flex-col items-center justify-start">
				{chain.map((link) => link && <Linkk key={link.id} link={link} />)}
			</div>
		</div>
	);
}
