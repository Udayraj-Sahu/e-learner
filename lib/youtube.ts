const YT = "https://www.googleapis.com/youtube/v3";

function key() {
	const k = process.env.YOUTUBE_API_KEY;
	if (!k) throw new Error("Missing YOUTUBE_API_KEY");
	return k;
}


interface YouTubeThumbnail {
	url: string;
	width?: number;
	height?: number;
}

interface YouTubeThumbnails {
	default?: YouTubeThumbnail;
	medium?: YouTubeThumbnail;
	high?: YouTubeThumbnail;
	standard?: YouTubeThumbnail;
	maxres?: YouTubeThumbnail;
}

interface YouTubePlaylistSnippet {
	title: string;
	description?: string;
	channelTitle?: string;
	thumbnails?: YouTubeThumbnails;
}

interface YouTubePlaylistItem {
	snippet?: {
		title?: string;
		description?: string;
		thumbnails?: YouTubeThumbnails;
		resourceId?: { videoId?: string };
	};
	contentDetails?: { videoId?: string };
}



export async function ytPlaylistInfo(playlistId: string) {
	const url = new URL(`${YT}/playlists`);
	url.searchParams.set("key", key());
	url.searchParams.set("part", "snippet");
	url.searchParams.set("id", playlistId);

	const res = await fetch(url, { cache: "no-store" });
	if (!res.ok) throw new Error(`playlists failed: ${res.status}`);

	const json = await res.json();
	const item = json.items?.[0];
	if (!item) throw new Error("Playlist not found");

	const snippet = item.snippet as YouTubePlaylistSnippet;

	return {
		title: snippet.title,
		description: snippet.description ?? "",
		channelTitle: snippet.channelTitle ?? "",
		thumbnails: snippet.thumbnails ?? {},
	};
}

export async function ytPlaylistItemsAll(
	playlistId: string,
	max = 100
): Promise<YouTubePlaylistItem[]> {
	const acc: YouTubePlaylistItem[] = [];
	let pageToken: string | undefined;

	do {
		const url = new URL(`${YT}/playlistItems`);
		url.searchParams.set("key", key());
		url.searchParams.set("part", "snippet,contentDetails");
		url.searchParams.set("playlistId", playlistId);
		url.searchParams.set(
			"maxResults",
			String(Math.min(50, max - acc.length))
		);
		if (pageToken) url.searchParams.set("pageToken", pageToken);

		const res = await fetch(url, { cache: "no-store" });
		if (!res.ok) throw new Error(`playlistItems failed: ${res.status}`);

		const data = await res.json();
		acc.push(...(data.items as YouTubePlaylistItem[]));
		pageToken = data.nextPageToken;
	} while (pageToken && acc.length < max);

	return acc;
}

export function parsePlaylistId(input: string) {
	
	try {
		if (/^[A-Za-z0-9_-]{10,}$/.test(input)) return input;
		const u = new URL(input);
		const id = u.searchParams.get("list");
		if (id) return id;
	} catch {
	
	}
	throw new Error("Invalid playlist URL/ID");
}

export function toSlug(s: string) {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")
		.slice(0, 60);
}
