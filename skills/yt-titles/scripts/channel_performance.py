#!/usr/bin/env python3
"""Fetch your channel's videos sorted by performance metrics.

Pulls recent videos from the channel using yt-dlp, calculates performance
metrics, and outputs them ranked by view count so title patterns can be
analyzed.

SETUP: Set YOUR_CHANNEL_URL below to your YouTube channel's videos page.
       Example: https://www.youtube.com/@YourChannelHandle/videos
"""

import io
import json
import shutil
import subprocess
import sys
from datetime import datetime, timedelta

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# ====================================================================
# CONFIGURE THIS: Set to your YouTube channel's videos page URL
# ====================================================================
CHANNEL_URL = "https://www.youtube.com/@YOUR_CHANNEL_HANDLE/videos"


def parse_args(argv):
    """Parse --count N and --months N from argv."""
    args = argv[1:]
    count = 30
    months = 3
    i = 0
    while i < len(args):
        if args[i] == "--count" and i + 1 < len(args):
            try:
                count = int(args[i + 1])
            except ValueError:
                print(f"Error: --count requires an integer, got '{args[i + 1]}'", file=sys.stderr)
                sys.exit(1)
            i += 2
        elif args[i] == "--months" and i + 1 < len(args):
            try:
                months = int(args[i + 1])
            except ValueError:
                print(f"Error: --months requires an integer, got '{args[i + 1]}'", file=sys.stderr)
                sys.exit(1)
            i += 2
        else:
            i += 1
    return count, months


def format_views(n):
    if n is None:
        return "N/A"
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.1f}K"
    return str(n)


def format_date(raw):
    if not raw or len(raw) != 8:
        return "N/A"
    try:
        dt = datetime.strptime(raw, "%Y%m%d")
        return dt.strftime("%b %d, %Y")
    except ValueError:
        return raw


def days_since(raw):
    """Calculate days since upload for views/day metric."""
    if not raw or len(raw) != 8:
        return None
    try:
        dt = datetime.strptime(raw, "%Y%m%d")
        delta = datetime.now() - dt
        return max(delta.days, 1)
    except ValueError:
        return None


def main():
    if "YOUR_CHANNEL_HANDLE" in CHANNEL_URL:
        print("Error: Update CHANNEL_URL in this script with your YouTube channel URL.", file=sys.stderr)
        print("Example: https://www.youtube.com/@YourChannel/videos", file=sys.stderr)
        sys.exit(1)

    count, months = parse_args(sys.argv)

    if not shutil.which("yt-dlp"):
        print("Error: yt-dlp not found. Install with: pip install yt-dlp", file=sys.stderr)
        sys.exit(1)

    # Fetch enough videos to account for filtering
    fetch_count = count * 2
    cmd = [
        "yt-dlp",
        CHANNEL_URL,
        "--dump-json",
        "--no-download",
        "--no-warnings",
        "--quiet",
        "--playlist-end", str(fetch_count),
    ]

    print(f"Fetching channel videos (last {months} months, top {count})...\n", file=sys.stderr)

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    except subprocess.TimeoutExpired:
        print("Error: Timed out fetching channel videos.", file=sys.stderr)
        sys.exit(1)

    if result.returncode != 0 and not result.stdout.strip():
        print(f"Error: yt-dlp failed:\n{result.stderr.strip()}", file=sys.stderr)
        sys.exit(1)

    videos = []
    for line in result.stdout.strip().splitlines():
        if not line.strip():
            continue
        try:
            videos.append(json.loads(line))
        except json.JSONDecodeError:
            continue

    if not videos:
        print("No videos found on channel.", file=sys.stderr)
        sys.exit(0)

    # Filter by date
    cutoff = (datetime.now() - timedelta(days=months * 30)).strftime("%Y%m%d")
    videos = [v for v in videos if (v.get("upload_date") or "00000000") >= cutoff]

    if not videos:
        print(f"No videos found in the last {months} months.", file=sys.stderr)
        sys.exit(0)

    # Calculate performance metrics and sort by views
    for v in videos:
        views = v.get("view_count") or 0
        age = days_since(v.get("upload_date"))
        v["_views_per_day"] = round(views / age, 1) if age else 0

    videos.sort(key=lambda v: v.get("view_count") or 0, reverse=True)
    videos = videos[:count]

    # Output
    divider = "\u2500" * 70
    subs = videos[0].get("channel_follower_count") if videos else None
    subs_str = format_views(subs) if subs else "N/A"
    channel_name = videos[0].get("channel", "Your Channel") if videos else "Your Channel"
    print(f"{channel_name} ({subs_str} subscribers) \u2014 Top {len(videos)} videos, last {months} months\n")

    for i, v in enumerate(videos, 1):
        title = v.get("title", "Unknown")
        views = v.get("view_count") or 0
        date = format_date(v.get("upload_date"))
        vpd = v["_views_per_day"]
        duration = v.get("duration") or 0
        mins = duration // 60
        secs = duration % 60
        vid_id = v.get("id", "")
        likes = v.get("like_count") or 0

        engagement = ""
        if subs and subs > 0:
            ratio = views / subs
            engagement = f" | Engagement: {ratio:.2f}x"

        like_ratio = ""
        if likes and views:
            like_ratio = f" | Like ratio: {likes / views * 100:.1f}%"

        print(divider)
        print(f" {i:>2}. {title}")
        print(f"     Views: {format_views(views)} ({vpd:,.0f}/day) | {mins}:{secs:02d} | {date}{engagement}{like_ratio}")
        print(f"     https://youtube.com/watch?v={vid_id}")

    print(divider)

    # Also output JSON summary for programmatic use
    print("\n--- JSON_DATA ---")
    summary = []
    for v in videos:
        summary.append({
            "title": v.get("title"),
            "views": v.get("view_count") or 0,
            "views_per_day": v["_views_per_day"],
            "upload_date": format_date(v.get("upload_date")),
            "duration_seconds": v.get("duration") or 0,
            "like_count": v.get("like_count") or 0,
            "engagement_ratio": round((v.get("view_count") or 0) / subs, 2) if subs else None,
        })
    print(json.dumps(summary, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
