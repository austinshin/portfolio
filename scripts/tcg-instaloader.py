#!/usr/bin/env python3
import argparse
import json
import os
import sys
from datetime import timezone

try:
    import instaloader
except ImportError:
    print(
        "Instaloader is not installed. Run: python3 -m pip install instaloader",
        file=sys.stderr,
    )
    sys.exit(2)


def to_iso(dt):
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def build_loader():
    loader = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        quiet=True,
        max_connection_attempts=1,
    )

    username = os.getenv("INSTALOADER_USERNAME", "").strip()
    password = os.getenv("INSTALOADER_PASSWORD", "").strip()
    session_file = os.getenv("INSTALOADER_SESSIONFILE", "").strip()

    auth_status = "anonymous"

    if session_file and username:
        loader.load_session_from_file(username, session_file)
        auth_status = "session"
    elif username and password:
        loader.login(username, password)
        auth_status = "login"

    return loader, auth_status


def scrape_handles(handles, posts_per_handle):
    loader, auth_status = build_loader()
    items = []
    errors = []
    success_handles = 0

    for handle in handles:
        try:
            profile = instaloader.Profile.from_username(loader.context, handle)
        except Exception as error:
            print(f"Failed to load profile @{handle}: {error}", file=sys.stderr)
            errors.append({"handle": handle, "stage": "profile", "error": str(error)})
            continue

        count = 0
        try:
            for post in profile.get_posts():
                shortcode = getattr(post, "shortcode", "")
                media_id = getattr(post, "mediaid", "")
                if not shortcode and not media_id:
                    continue

                caption = getattr(post, "caption", None)
                timestamp = to_iso(getattr(post, "date_utc", None))
                post_url = f"https://www.instagram.com/p/{shortcode}/" if shortcode else None

                items.append(
                    {
                        "id": str(media_id or shortcode),
                        "shortCode": shortcode,
                        "caption": caption,
                        "url": post_url,
                        "type": getattr(post, "typename", None),
                        "displayUrl": getattr(post, "url", None),
                        "videoUrl": getattr(post, "video_url", None) if getattr(post, "is_video", False) else None,
                        "timestamp": timestamp,
                        "ownerUsername": handle,
                    }
                )

                count += 1
                if count >= posts_per_handle:
                    break
            success_handles += 1
        except Exception as error:
            print(f"Failed to read posts for @{handle}: {error}", file=sys.stderr)
            errors.append({"handle": handle, "stage": "posts", "error": str(error)})
            continue

    return items, auth_status, errors, success_handles


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--posts-per-handle", type=int, default=6)
    parser.add_argument("--handles", nargs="+", required=True)
    return parser.parse_args()


def main():
    args = parse_args()
    handles = [h.strip().lstrip("@").lower() for h in args.handles if h and h.strip()]
    posts_per_handle = max(1, min(args.posts_per_handle, 12))

    items, auth_status, errors, success_handles = scrape_handles(handles, posts_per_handle)
    if success_handles == 0 and len(handles) > 0:
        print(
            json.dumps(
                {
                    "posts": items,
                    "authStatus": auth_status,
                    "errors": errors,
                    "successHandles": success_handles,
                    "totalHandles": len(handles),
                }
            ),
            file=sys.stderr,
        )
        sys.exit(3)

    print(
        json.dumps(
            {
                "posts": items,
                "authStatus": auth_status,
                "errors": errors,
                "successHandles": success_handles,
                "totalHandles": len(handles),
            }
        )
    )


if __name__ == "__main__":
    main()
