import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/protected";

	if (!code) {
		return NextResponse.redirect(`${origin}/auth/auth-code-error`);
	}

	const supabase = createClient();
	const { error } = await supabase.auth.exchangeCodeForSession(code);

	if (error) {
		return NextResponse.redirect(`${origin}/auth/auth-code-error`);
	}

	const forwardedHost = request.headers.get("x-forwarded-host");
	const isLocalEnv = process.env.NODE_ENV === "development";

	if (isLocalEnv) {
		return NextResponse.redirect(`${origin}${next}`);
	}

	if (forwardedHost) {
		return NextResponse.redirect(`https://${forwardedHost}${next}`);
	}

	return NextResponse.redirect(`${origin}${next}`);
}
