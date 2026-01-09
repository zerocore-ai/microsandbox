const INSTALL_SCRIPT_URL = "https://raw.githubusercontent.com/zerocore-ai/microsandbox/refs/heads/main/scripts/install_microsandbox.sh";

export default {
  async fetch(request) {
    const response = await fetch(INSTALL_SCRIPT_URL);
    const script = await response.text();

    return new Response(script, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  },
};
