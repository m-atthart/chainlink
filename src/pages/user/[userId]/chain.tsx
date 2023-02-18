import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const Chain: NextPage = () => {
	const router = useRouter();
	const { userId } = router.query as { userId: string };

	//get chain of user from db
	const { data: chain } = trpc.useQuery(["example.getChain", { userId }]);

	return (
		<>
			<div>Chain for {userId}</div>
			<div>
				{chain?.map((link) => {
					return (
						<div key={link.id}>
							<p>{link.url}</p>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Chain;
