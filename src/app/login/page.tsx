"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default async function Page(): Promise<JSX.Element> {
	const supabase = createClient();
	const loginWithGoogle = () => {
		supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${location.origin}/auth/callback`,
			},
		});
	};

	return (
		<div>
			<section className="bg-ct-blue-600 min-h-screen pt-20">
				<div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
					<div className="md:w-8/12 lg:w-5/12 bg-white px-8 py-10">
						<div className="mb-6">
							<button onClick={loginWithGoogle} type="button">
								<Image
									className="pr-2"
									src="/images/google.svg"
									alt=""
									style={{ height: "2rem" }}
									width={35}
									height={35}
								/>
								Continue with Google
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
