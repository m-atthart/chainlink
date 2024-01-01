import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";
import { api } from "~/trpc/server";
// import { useUser, useAuth } from "@clerk/nextjs";
import { getServerAuthSession } from "~/server/auth";

import { AddLinkk } from "../_components/add-linkk";

export default async function Chain() {
  //   const { isLoaded, isSignedIn, user } = useUser();
  //   const { signOut } = useAuth();
  const session = await getServerAuthSession();
  const sessionUser = session?.user;
  //   const router = useRouter();
  //   const { user: queryUser } = router.query as { user?: string };
  const queryUser = "matt";

  //   useEffect(() => {
  //     if (queryUser === "me" && isLoaded) {
  //       if (!user) router.push("/login");
  //       else router.push(`/${user.username}`);
  //     }
  //   }, [isLoaded, user, queryUser, router]);

  const { data: chain } = await api.post.getChain.query({
    username: queryUser ?? "",
  });

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-8 bg-gradient-to-br from-gradient-start to-gradient-end">
      <header className="flex w-full items-center justify-end p-8">
        <div className="m-2 flex h-12 w-36 items-center justify-center bg-slate-600 text-white">
          <p>Hello {sessionUser && sessionUser.name}</p>
        </div>
        <button
          className="h-12 w-36 bg-slate-600 text-white"
          //   onClick={isSignedIn ? () => signOut() : () => router.push("/login")}
        >
          {sessionUser ? "Sign Out" : "Sign In"}
        </button>
      </header>
      {sessionUser && queryUser === sessionUser.name && <AddLinkk />}
      <div className="flex w-full max-w-screen-xl flex-col items-center justify-start">
        {chain?.map((link) => <Linkk key={link.id} link={link} />)}
      </div>
    </div>
  );
}

const Linkk = ({
  link,
}: {
  link: {
    id: number;
    url: string;
    notes: string | null;
    ogTitle: string | null;
    ogSiteName: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    username: string;
  };
}) => {
  return (
    <div
      className="m-2 flex min-h-min w-10/12 flex-col items-start justify-start gap-4 rounded-lg border-2 bg-white p-4"
      key={link.id}
    >
      <Link
        className="h-full w-full"
        href={link.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="flex w-full flex-col justify-start gap-4 rounded-lg p-4 shadow-md shadow-slate-200 md:flex-row">
          <div className="relative aspect-video w-full bg-slate-100 md:h-36 md:w-auto">
            {link.ogImage ? (
              <Image
                className="object-cover"
                src={link.ogImage}
                fill={true}
                alt=""
              />
            ) : (
              <Image
                className="scale-50 object-contain"
                src="https://cdn-icons-png.flaticon.com/512/2088/2088090.png"
                fill={true}
                alt=""
              />
            )}
          </div>
          <div className="flex h-full flex-col justify-start">
            <h3 className="text-xl">
              {link.ogTitle ?? link.ogSiteName ?? link.url}
            </h3>
            <p className="text-gray-500">{link.ogDescription}</p>
          </div>
        </div>
      </Link>
      {link.notes && (
        <div>
          <p>Notes:</p>
          <p>{link.notes}</p>
        </div>
      )}
    </div>
  );
};
