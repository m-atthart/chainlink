import Image from "next/image";
import Link from "next/link";

type Linkk = {
	id: number;
	url: string;
	notes: string | null;
	ogTitle: string | null;
	ogSiteName: string | null;
	ogDescription: string | null;
	ogImage: string | null;
	authorId: string;
	timestamp: Date;
};

export function Linkk({ link }: { link: Linkk }) {
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
}
