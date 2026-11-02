"""Local-only patch of the cloned parser: keep spawn point height/rotation and dump company placements."""
import sys

root = sys.argv[1]


def sub(rel, old, new):
    p = f"{root}/{rel}"
    t = open(p, encoding="utf-8", newline="").read()
    nl = "\r\n" if "\r\n" in t else "\n"
    old, new = old.replace("\n", nl), new.replace("\n", nl)
    assert t.count(old) == 1, (rel, old, t.count(old))
    open(p, "w", encoding="utf-8", newline="").write(t.replace(old, new))


sub(
    "packages/clis/parser/game-files/prefab-ppd-parser.ts",
    """        x: rp.pos[0],
        y: rp.pos[2],
      };
    }),
    mapPoints""",
    """        x: rp.pos[0],
        y: rp.pos[2],
        z: rp.pos[1],
        rot: rp.rot,
      };
    }),
    mapPoints""",
)

sub(
    "packages/clis/parser/game-files/map-files-parser.ts",
    """        if (!icons.has(item.token)) {
          noPoiCompanies.push({""",
    """        {
          const pd = assertExists(defData.prefabs.get(prefabItem.token));
          const origin = assertExists(nodesByUid.get(prefabItem.nodeUids[0]));
          const prefabOrigin = pd.nodes[prefabItem.originNodeIndex];
          const dump = ((globalThis as any).__companyPlacements ??= []);
          dump.push({
            company: item.token,
            city: item.cityToken,
            prefab: prefabItem.token,
            originZ: origin.z,
            originQuat: origin.rotationQuat,
            originRotation: origin.rotation,
            prefabOriginZ: prefabOrigin.z,
            prefabOriginRotation: prefabOrigin.rotation,
            prefabOriginDir: (prefabOrigin as any).rotationDir,
            points: pd.spawnPoints.map(sp => {
              const [x, y] = toMapPosition(
                [sp.x, sp.y],
                prefabItem,
                pd,
                nodesByUid,
              );
              return {
                type: sp.type,
                x,
                y,
                localX: sp.x,
                localY: sp.y,
                localZ: (sp as any).z,
                rot: (sp as any).rot,
              };
            }),
          });
        }
        if (!icons.has(item.token)) {
          noPoiCompanies.push({""",
)

sub(
    "packages/clis/parser/index.ts",
    """  const { map, ...result } = parseMapFiles(scsFilePaths, args);
""",
    """  const { map, ...result } = parseMapFiles(scsFilePaths, args);
  fs.mkdirSync(args.outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(args.outputDir, `${map}-company-placements.json`),
    JSON.stringify((globalThis as any).__companyPlacements ?? [], (_k, v) =>
      typeof v === 'bigint' ? v.toString() : v,
    ),
  );
""",
)
# Newer game versions than the parser targets: these checks don't affect company data.
sub(
    "packages/clis/parser/game-files/map-files-parser.ts",
    "pngs.set(key, parseDds(tobj.read(), sdfAuxData.get(key)));",
    "try { pngs.set(key, parseDds(tobj.read(), sdfAuxData.get(key))); } catch { /* icons are not needed */ }",
)
sub(
    "packages/clis/parser/game-files/def-parser.ts",
    "if (!/^(prefab|road_look|sign|model)\./.test(f) || !f.endsWith('.sii')) {",
    "if (f === 'model.stable.sii' || !/^(prefab|road_look|sign|model)\./.test(f) || !f.endsWith('.sii')) {",
)
sub(
    "packages/clis/parser/game-files/def-parser.ts",
    "  const { laneSpeedClass, limit, maxLimit, urbanLimit } =
    obj.countrySpeedLimit['.speed_limit.truck'];
",
    "  if (obj) return {} as SpeedLimits;
  const { laneSpeedClass, limit, maxLimit, urbanLimit } =
    obj.countrySpeedLimit['.speed_limit.truck'];
",
)
print("parser patched")
