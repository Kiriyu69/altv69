import playlists from "../data/index.js";

const HOMEPAGE = "https://alantv.my.id/";

const browserAllowedPaths = [
  "",
  "index.html",
  "style.css",
  "script.js",
  "playlist-list.js",
  "nyawits.png",
  "app.apk",
  "favicon.ico",
  "favicon-home.png",
  "robots.txt",
  "sitemap.xml"
];

export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);

  // Redirect Pages.dev ke Custom Domain
  if (url.hostname === "altv69.pages.dev") {
    url.hostname = "alantv.my.id";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  let path = context.params.playlist || "";

  path = Array.isArray(path)
    ? path.join("/")
    : path;

  path = path
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();

  const ua = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";
  const secFetchDest = request.headers.get("sec-fetch-dest") || "";
  const secFetchMode = request.headers.get("sec-fetch-mode") || "";

  const lowerUA = ua.toLowerCase();
  const lowerAccept = accept.toLowerCase();

  const isDownloader =
    lowerUA.includes("idm") ||
    lowerUA.includes("internet download manager") ||
    lowerUA.includes("adm") ||
    lowerUA.includes("advanced download manager") ||
    lowerUA.includes("wget") ||
    lowerUA.includes("curl") ||
    lowerUA.includes("python") ||
    lowerUA.includes("aria2") ||
    lowerUA.includes("postman") ||
    lowerUA.includes("axios");

  const isPlayer =
    lowerUA.includes("ott") ||
    lowerUA.includes("navigator") ||
    lowerUA.includes("iptv") ||
    lowerUA.includes("tivimate") ||
    lowerUA.includes("vlc") ||
    lowerUA.includes("kodi") ||
    lowerUA.includes("exoplayer") ||
    lowerUA.includes("exo") ||
    lowerUA.includes("dalvik") ||
    lowerUA.includes("lavf") ||
    lowerUA.includes("okhttp");

  const isBrowser =
    secFetchDest === "document" ||
    secFetchMode === "navigate" ||
    lowerAccept.includes("text/html") ||
    lowerUA.includes("mozilla") ||
    lowerUA.includes("chrome") ||
    lowerUA.includes("firefox") ||
    lowerUA.includes("safari") ||
    lowerUA.includes("edg");

  // Block downloader
  if (isDownloader) {
    return new Response("Forbidden", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  // Browser hanya boleh akses file whitelist
  if (isBrowser && !isPlayer) {
    if (browserAllowedPaths.includes(path)) {
      return await context.next();
    }

    return Response.redirect(HOMEPAGE, 302);
  }

  // File statis whitelist tetap boleh lewat
  if (browserAllowedPaths.includes(path)) {
    return await context.next();
  }

  // Selain player tidak boleh akses playlist
  if (!isPlayer) {
    return Response.redirect(HOMEPAGE, 302);
  }

  // Playlist tidak ditemukan
  if (!playlists[path]) {
    return Response.redirect(HOMEPAGE, 302);
  }

  // Playlist untuk OTT/IPTV
  return new Response(playlists[path], {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
