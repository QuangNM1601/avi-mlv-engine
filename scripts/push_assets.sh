#!/usr/bin/env bash
# Đưa file của 1 dự án lên repo engine để engine tải qua jsDelivr (chạy trong workspace của Claude).
# Dùng: bash push_assets.sh <slug> <file>... [--dry]
#   Ảnh đổi tên theo vai trò nếu tên chứa: logo → logo.png, render/phoi-canh → render.jpg; còn lại giữ tên.
#   Yêu cầu: đã add_repo QuangNM1601/avi-mlv-engine (access push) trong phiên.
# In ra 1 dòng JSON: {"ok", "commit", "urls": {tên: URL jsDelivr}, "raw": {tên: URL raw}}
set -euo pipefail
REPO_URL="https://github.com/QuangNM1601/avi-mlv-engine"
DIR="${MLV_REPO_DIR:-$HOME/.mlv-assets}"
DRY=0; ARGS=()
for a in "$@"; do [ "$a" = "--dry" ] && DRY=1 || ARGS+=("$a"); done
[ "${#ARGS[@]}" -ge 2 ] || { echo '{"ok":false,"err":"Dùng: push_assets.sh <slug> <file>... [--dry]"}'; exit 2; }
SLUG="${ARGS[0]}"; FILES=("${ARGS[@]:1}")
[[ "$SLUG" =~ ^[a-z0-9-]+$ ]] || { echo '{"ok":false,"err":"slug chỉ gồm a-z, 0-9, -"}'; exit 2; }

if ! git -C "$DIR" rev-parse HEAD >/dev/null 2>&1; then
  git clone --depth 1 "$REPO_URL" "$DIR" >/dev/null 2>&1 || { echo '{"ok":false,"err":"Không clone được repo (chưa add_repo?)"}'; exit 2; }
fi
cd "$DIR"
git fetch -q --depth 1 origin main && git reset -q --hard origin/main
mkdir -p "assets/$SLUG"
NAMES=()
for f in "${FILES[@]}"; do
  [ -f "$f" ] || { echo "{\"ok\":false,\"err\":\"Không thấy file: $f\"}"; exit 2; }
  base="$(basename "$f")"; lower="$(echo "$base" | tr 'A-Z' 'a-z')"; ext="${lower##*.}"
  case "$lower" in
    *logo*) name="logo.$ext" ;;
    *render*|*phoi-canh*|*phoicanh*) name="render.$ext" ;;
    *) name="$lower" ;;
  esac
  [ "$(stat -c %s "$f")" -le 15000000 ] || { echo "{\"ok\":false,\"err\":\"$base quá 15 MB\"}"; exit 2; }
  cp "$f" "assets/$SLUG/$name"; NAMES+=("$name")
done
git add "assets/$SLUG"
if git diff --cached --quiet; then
  COMMIT="$(git rev-parse HEAD)"
else
  git -c user.name="mlv-bot" -c user.email="mlv-bot@users.noreply.github.com" commit -q -m "assets: $SLUG (${NAMES[*]})"
  if [ "$DRY" = 1 ]; then COMMIT="$(git rev-parse HEAD)"; git reset -q --hard origin/main
  else
    for i in 1 2 3; do git push -q origin HEAD:main 2>/dev/null && break || { git fetch -q --depth 1 origin main; git rebase -q origin/main; sleep 2; }; done
    git fetch -q --depth 1 origin main
    [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || { echo '{"ok":false,"err":"Push không thành công"}'; exit 2; }
    COMMIT="$(git rev-parse HEAD)"
  fi
fi
python3 -I - "$COMMIT" "$SLUG" "$DRY" "${NAMES[@]}" <<'PY'
import json, sys
c, slug, dry, names = sys.argv[1], sys.argv[2], sys.argv[3] == "1", sys.argv[4:]
cdn = f"https://cdn.jsdelivr.net/gh/QuangNM1601/avi-mlv-engine@{c}/assets/{slug}/"
raw = f"https://raw.githubusercontent.com/QuangNM1601/avi-mlv-engine/{c}/assets/{slug}/"
print(json.dumps({"ok": True, "dry": dry, "commit": c, "urls": {n: cdn + n for n in names}, "raw": {n: raw + n for n in names}}, ensure_ascii=False))
PY
