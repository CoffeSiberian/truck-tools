"""Builds src-tauri/src/embeds/route_catalog_{ets2,ats}.json from truckermudgeon/maps parser output.

Run patch_parser.py on a clone of the parser first (see README.md in this folder), then:
    python gen_route_data.py <dir with out_ats and out_ets2> <repo root>
"""
import json
import math
import struct
import sys

SPAWN_TRAILER = 1
SPAWN_UNLOAD_EASY = 2
SPAWN_UNLOAD_MEDIUM = 19
SPAWN_UNLOAD_HARD = 20
SPAWN_UNLOAD_RIGID = 21
SPAWN_LONG_TRAILER = 25


def number(value):
    """Formats a float the way game saves do: plain when integral, otherwise &hex."""
    value = float(value)
    if value == int(value) and abs(value) < 1e7:
        return str(int(value))
    return "&" + struct.pack(">f", value).hex()


def qmul(a, b):
    w1, x1, y1, z1 = a
    w2, x2, y2, z2 = b
    return [
        w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
        w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
        w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
        w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
    ]


def placement(item, point):
    """World placement of a prefab spawn point, checked against real player_job placements."""
    yaw = item["originRotation"] - item["prefabOriginRotation"]
    height = item["originZ"] - item["prefabOriginZ"] + point["localZ"]
    w, x, y, z = qmul([math.cos(yaw / 2), 0, -math.sin(yaw / 2), 0], point["rot"])
    return (
        f"({number(point['x'])}, {number(height)}, {number(point['y'])}) "
        f"({number(w)}; {number(x)}, {number(y)}, {number(z)})"
    )


def clean_cargo_name(name, token):
    # The parser can't resolve every 1.61 locale key and leaves "cn some cargo".
    label = name[3:] if name.startswith("cn ") else name
    label = label or token.replace("_", " ")
    return " ".join(word[:1].upper() + word[1:] for word in label.split())


def build(folder, map_name):
    def load(kind):
        with open(f"{folder}/{map_name}-{kind}.json", encoding="utf-8") as f:
            return json.load(f)

    places = {}
    for item in load("company-placements"):
        key = f"{item['company']}.{item['city']}"
        by_type = {}
        for point in item["points"]:
            by_type.setdefault(point["type"], []).append(point)
        trailers = by_type.get(SPAWN_TRAILER, [])
        long_trailers = by_type.get(SPAWN_LONG_TRAILER, [])
        anchor = (trailers + long_trailers + by_type.get(SPAWN_UNLOAD_EASY, []) + item["points"])[:1]
        if not anchor or (key in places and places[key]["trailer"]):
            continue

        def one(spawn_type):
            return placement(item, by_type[spawn_type][0]) if spawn_type in by_type else None

        places[key] = {
            "x": round(anchor[0]["x"], 1),
            "y": round(anchor[0]["y"], 1),
            "trailer": [placement(item, p) for p in trailers[:4]],
            "long_trailer": [placement(item, p) for p in long_trailers[:2]],
            "easy": one(SPAWN_UNLOAD_EASY),
            "medium": one(SPAWN_UNLOAD_MEDIUM),
            "hard": one(SPAWN_UNLOAD_HARD),
            "rigid": one(SPAWN_UNLOAD_RIGID),
        }

    companies = {
        c["token"]: {
            "name": c["name"],
            "cargo_out": [t.replace("cargo.", "") for t in c["cargoOutTokens"]],
            "cargo_in": [t.replace("cargo.", "") for t in c["cargoInTokens"]],
        }
        for c in load("companyDefs")
    }
    cargos = {
        c["token"]: {
            "name": clean_cargo_name(c["name"], c["token"]),
            "body_types": c.get("bodyTypes", []),
            "volume": c.get("volume", 1),
            "mass": c.get("mass", 0),
        }
        for c in load("cargoes")
    }
    cities = {c["token"]: {"name": c["name"], "region": c.get("countryToken", "")} for c in load("cities")}
    return {"companies": companies, "cargos": cargos, "cities": cities, "places": places}


out_dir, repo = sys.argv[1], sys.argv[2]
for game, folder, map_name in (("ats", "out_ats", "usa"), ("ets2", "out_ets2", "europe")):
    catalog = build(f"{out_dir}/{folder}", map_name)
    path = f"{repo}/src-tauri/src/embeds/route_catalog_{game}.json"
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(catalog, f, ensure_ascii=False, separators=(",", ":"))
    print(game, {k: len(v) for k, v in catalog.items()})
