import { TURNSTILE_SECRET_KEY } from "astro:env/server";

export async function verifyTurnstileToken(
  token: string,
  ip?: string,
): Promise<boolean> {
  const formData = new URLSearchParams({
    secret: TURNSTILE_SECRET_KEY,
    response: token,
  });

  // Add IP address if available for better verification
  if (ip) {
    formData.append("remoteip", ip);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      },
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
