#!/usr/bin/env python3
import argparse
import json
import os
import random
import sys
import time
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


def get_env_float(name, default_value):
    raw = os.getenv(name, "").strip()
    if not raw:
        return float(default_value)
    try:
        return float(raw)
    except ValueError:
        return float(default_value)


def get_env_int(name, default_value):
    raw = os.getenv(name, "").strip()
    if not raw:
        return int(default_value)
    try:
        return int(raw)
    except ValueError:
        return int(default_value)


def is_rate_limited(error):
    message = str(error).lower()
    return "429" in message or "too many requests" in message or "please wait a few minutes" in message


def get_retry_delay(base_seconds, attempt):
    jitter = random.uniform(0.5, 2.0)
    return max(0.0, base_seconds * attempt + jitter)


def scrape_single_handle(loader, handle, posts_per_handle, max_retries, retry_backoff_seconds):
    last_error = None
    for attempt in range(1, max_retries + 1):
        try:
            profile = instaloader.Profile.from_username(loader.context, handle)
            handle_items = []
            count = 0
            for post in profile.get_posts():
                shortcode = getattr(post, "shortcode", "")
                media_id = getattr(post, "mediaid", "")
                if not shortcode and not media_id:
                    continue

                caption = getattr(post, "caption", None)
                timestamp = to_iso(getattr(post, "date_utc", None))
                post_url = f"https://www.instagram.com/p/{shortcode}/" if shortcode else None

                handle_items.append(
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

            return handle_items, None
        except Exception as error:
            last_error = error
            if attempt < max_retries and is_rate_limited(error):
                delay_seconds = get_retry_delay(retry_backoff_seconds, attempt)
                print(
                    f"Rate limited on @{handle}, retrying in {delay_seconds:.1f}s (attempt {attempt}/{max_retries})",
                    file=sys.stderr,
                )
                time.sleep(delay_seconds)
                continue
            break

    return [], last_error


def scrape_handles(handles, posts_per_handle):
    loader, auth_status = build_loader()
    items = []
    errors = []
    success_handles = 0
    max_retries = max(1, min(get_env_int("INSTALOADER_MAX_RETRIES", 3), 8))
    retry_backoff_seconds = max(1.0, get_env_float("INSTALOADER_RETRY_BACKOFF_SECONDS", 8.0))
    handle_delay_seconds = max(0.0, get_env_float("INSTALOADER_HANDLE_DELAY_SECONDS", 2.0))

    for index, handle in enumerate(handles):
        handle_items, error = scrape_single_handle(
            loader, handle, posts_per_handle, max_retries, retry_backoff_seconds
        )
        if error is not None:
            print(f"Failed to load/read @{handle}: {error}", file=sys.stderr)
            errors.append({"handle": handle, "stage": "profile_or_posts", "error": str(error)})
        else:
            items.extend(handle_items)
            success_handles += 1

        if index < len(handles) - 1 and handle_delay_seconds > 0:
            delay_seconds = handle_delay_seconds + random.uniform(0.0, 1.0)
            time.sleep(delay_seconds)

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
