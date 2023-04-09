import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../utils/trpc";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { parse } from "parse5";
import { Element } from "parse5/dist/tree-adapters/default";

const Chain = () => {
	const { isLoaded, isSignedIn, user } = useUser();
	const { signOut } = useAuth();
	const router = useRouter();
	const { user: queryUser } = router.query as { user?: string };

	useEffect(() => {
		if (queryUser === "me" && isLoaded) {
			if (!user) router.push("/login");
			else router.push(`/${user.username}`);
		}
	}, [isLoaded, user, queryUser, router]);

	const { data: chain } = api.getChain.useQuery({ username: queryUser ?? "" });

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-start gap-8 bg-gradient-to-br from-gradient-start to-gradient-end">
			<header className="flex w-full items-center justify-end p-8">
				<div className="m-2 flex h-12 w-36 items-center justify-center bg-slate-600 text-white">
					<p>Hello {user?.username}</p>
				</div>
				<button
					className="h-12 w-36 bg-slate-600 text-white"
					onClick={isSignedIn ? () => signOut() : () => router.push("/login")}
				>
					{isSignedIn ? "Sign Out" : "Sign In"}
				</button>
			</header>
			{isSignedIn && <AddLinkk />}
			<div className="flex w-full min-w-fit max-w-7xl flex-col items-center justify-start md:w-3/5">
				{chain?.map((link) => (
					<Linkk key={link.id} link={link} />
				))}
			</div>
		</div>
	);
};

const AddLinkk = () => {
	const [inputUrl, setInputUrl] = useState("");
	const [notes, setNotes] = useState("");

	const { user: currentUser } = useUser();
	const ctx = api.useContext();
	const { mutate: addToChain } = api.addToChain.useMutation({
		onSuccess: () =>
			currentUser?.username &&
			ctx.getChain.invalidate({ username: currentUser.username }),
	});

	const addLinkk = () => {
		addToChain({ url: inputUrl, notes });
		setInputUrl("");
		setNotes("");
	};

	useEffect(() => {
		getOgProperties(
			"https://twitter.com/ThePrimeagen/status/1641499089199063052"
		).then((properties) => console.log(properties));
	}, []);

	if (status === "loading") return <div>Loading...</div>;

	return (
		<div className="flex flex-col items-center gap-2">
			<input
				className="w-96 rounded-md p-2"
				type="text"
				placeholder="URL"
				value={inputUrl}
				onChange={(e) => setInputUrl(e.target.value)}
			></input>
			<textarea
				className="h-44 w-96 rounded-md p-2"
				placeholder="Notes"
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
			></textarea>
			<button
				className="h-12 w-28 rounded-md bg-blue-600 text-white"
				onClick={addLinkk}
			>
				Add Linkk
			</button>
		</div>
	);
};

type OgProperties = { [key: string]: string | undefined }[];

function getOgProperties(url: string) {
	return fetch(url)
		.then((res) => res.text())
		.then((data) => {
			const document = parse(data);
			const html = document.childNodes[0] as Element;
			const head = html.childNodes[0] as Element;
			console.log(head.childNodes);
			const metaTags = head.childNodes.filter(
				(node) => node.nodeName === "meta"
			) as Element[];
			const ogTags = metaTags.filter((tag) =>
				tag.attrs.some(
					(attr) => attr.name === "property" && attr.value.startsWith("og:")
				)
			) as Element[];
			const ogProperties = ogTags.map((tag) => {
				const content = tag.attrs.find(
					(attr) => attr.name === "content"
				)?.value;
				const property = tag.attrs
					.find((attr) => attr.name === "property")
					?.value.slice(3)!;
				return { [property]: content };
			});
			return ogProperties;
		});
}

const Linkk = ({
	link,
}: {
	link: { id: number; url: string; notes: string | null; username: string };
}) => {
	const [ogProperties, setOgProperties] = useState<OgProperties>([]);

	useEffect(() => {
		//getOgProperties(link.url).then((properties) => setOgProperties(properties));
	}, [link.url]);

	useEffect(() => {
		//console.log(ogProperties);
	}, [ogProperties]);

	return (
		<div
			className="m-2 flex min-h-min w-4/5 flex-col items-start justify-start gap-4 rounded-lg border-2 bg-white p-4"
			key={link.id}
		>
			<div className="flex flex-col justify-start gap-4 rounded-lg p-4 shadow-md shadow-slate-200 md:flex-row">
				<div className="aspect-video w-full bg-slate-100 md:h-36 md:w-auto">
					thumbnail
				</div>
				<div className="flex h-full flex-col justify-start">
					<h3 className="text-xl">Title Title Title Title Title Title</h3>
					<p className="text-gray-500">
						Subtitle Subtitle Subtitle Subtitle Subtitle Subtitle Subtitle
						Subtitle Subtitle Subtitle Subtitle Subtitle Subtitle Subtitle
					</p>
				</div>
			</div>
			{link.notes && (
				<div>
					<p>Notes:</p>
					<p>{link.notes}</p>
				</div>
			)}
		</div>
	);
};

const ChainPage: NextPage = () => {
	return (
		<>
			<Head>
				<title>ChainLinkk</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Chain />
		</>
	);
};

export default ChainPage;
