import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { AuthResponse } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await axios.post<AuthResponse>(
      `${process.env.API_BASE_URL}/users/register`,
      body,
    );

    const data = apiRes.data;

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return NextResponse.json({ name: data.name, email: data.email });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.message || "Помилка реєстрації" },
        { status: error.response.status },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
