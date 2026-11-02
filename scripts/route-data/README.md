# Route catalog data

`src-tauri/src/embeds/route_catalog_{ets2,ats}.json` hold, per game, the company and cargo
names, what each company ships and receives, and the placements used to teleport and to
create active jobs. Regenerate them when a game update changes the map:

```bash
git clone https://github.com/truckermudgeon/maps.git tsmaps
git -C tsmaps submodule update --init packages/clis/parser/gdeflate/libdeflate
cd tsmaps && npm install --ignore-scripts --engine-strict=false -w packages/clis/parser
npm --prefix packages/clis/parser exec --yes -- node-gyp@11 rebuild
cd .. && python patch_parser.py tsmaps
```

Then run the parser (GPL-3.0, [truckermudgeon/maps](https://github.com/truckermudgeon/maps))
once per game from `tsmaps/`, with `NODE_OPTIONS=--max-old-space-size=8192`:

```bash
npx tsx packages/clis/parser/index.ts -i "<ATS install dir>" -o ../out_ats
```

```bash
npx tsx packages/clis/parser/index.ts -i "<ETS2 install dir>" -o ../out_ets2
```

Finally build the catalogs:

```bash
python gen_route_data.py . <repo root>
```

Only the base maps and official DLCs are covered, so companies from map mods have no placements.
Generated from ATS 1.61.3.18 and ETS2 1.61.1.9.
