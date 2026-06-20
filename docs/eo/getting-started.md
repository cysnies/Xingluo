# Komenci

Ĉi tiu gvidilo helpas vin komenci Xingluo por loka evoluigo kaj produktaj konstruoj de nulo.

## Postuloj

| Dependeco | Minimum versio | Notoj                                               |
| --------- | -------------- | --------------------------------------------------- |
| Node.js   | 22.12.0        | Vidu `engines.node` en `package.json`               |
| pnpm      | 10.x           | Pakaĵadministrilo (la projekto uzas pnpm workspace) |

> Konsilo: administru Node-version per [fnm](https://github.com/Schniz/fnm) aŭ [nvm](https://github.com/nvm-sh/nvm).

## Instalado

Post klonado de la deponejo, instalu dependecojn:

```bash
pnpm install
```

Post kiam dependecoj estas instalitaj, la referencaj projektoj sub `references/` estas aŭtomate ekskluditaj de TypeScript-kompilado kaj konstruoj (vidu `exclude` en `tsconfig.json`).

## Loka evoluigo

Komencu la evoluservilon (defaŭlte `http://localhost:4321/`):

```bash
pnpm dev
```

En evoluiga reĝimo:

- Malnetoj kaj planitaj afiŝoj estas **ĉiuj videblaj** (por antaŭrigardo); ili estas filtritaj nur dum produktaj konstruoj
- Ŝanĝoj de enhavkolektoj ekigas varman reŝargon
- Klient-flankaj kondutoj (tema ŝaltado, View Transitions, ktp.) kongruas kun produktado

## Tipo-sinkronigo

Post modifo de enhavkolektaj skemoj aŭ tipoj, rulu sync por refreŝigi `.astro/types.d.ts`:

```bash
pnpm sync
```

## Konstruo

La produktokonstruo havas tri paŝojn (vidu la `build`-skripton en `package.json`):

```bash
pnpm build
```

1. **`astro check`**: TypeScript- kaj Astro-ŝablona tiposekurigado; iu ajn eraro abortas la konstruon
2. **`astro build`**: statike generas la tutan retejon al `dist/` (inkluzive dinamikajn OG-bildojn, RSS, retejmapon, robots.txt, pagefind UI-aktivaĵojn)
3. **`pagefind --site dist`**: skanas `dist/` por generi la plentekstan serĉindekson en `dist/pagefind/`

> Noto: `pagefind` estas binara ilo instalita kiel devDependency; neniu ekstra agordo necesas.

## Antaŭrigardo de la konstruo

Antaŭrigardu la konstrurezulton en `dist/` loke:

```bash
pnpm preview
```

## Kvalito de kodo

| Komando             | Celo                                                            |
| ------------------- | --------------------------------------------------------------- |
| `pnpm format`       | Formatu tutan kodon per Prettier (inkluzive Astro kaj Tailwind) |
| `pnpm format:check` | Kontrolu formatigan konformecon (uzata en CI)                   |
| `pnpm lint`         | ESLint-kontroloj (inkluzive `eslint-plugin-astro`)              |

## Sekvaj paŝoj

- Legu la [Agordan gvidilon](./configuration.md) por agordi retejajn informojn kaj funkciojn
- Legu [Enhavan kreadon](./content.md) por komenci skribi
- Legu [Deplojon](./deployment.md) por publikigi vian retejon
