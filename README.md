# Boty

![Known Vulnerabilities](https://snyk.io/test/github/Yendric/boty/badge.svg)
![Issues](https://img.shields.io/github/issues/Yendric/boty)

Officiële Boty repository.

## Installatie

Vereisten: Node.js 22.12+, [pnpm](https://pnpm.io), en voor muziek: [yt-dlp](https://github.com/yt-dlp/yt-dlp) en ffmpeg in je PATH (in de Docker-image zit dit al).

1. Clone: `git clone git@github.com:Yendric/boty`
2. Installeer dependencies: `pnpm install`
3. Stel je _.env_ file in (zie _.env.example_)
4. Maak een build: `pnpm build`
5. Start de applicatie: `pnpm start`

Ontwikkelen kan met `pnpm dev` (herstart automatisch bij wijzigingen).

> **Muziek werkt niet meer?** YouTube verandert regelmatig iets waardoor streams breken, werk dan eerst yt-dlp bij (`yt-dlp -U` of rebuild de Docker-image). Krijg je "Sign in to confirm you're not a bot"-fouten, bekijk dan de [PO Token Guide](https://github.com/yt-dlp/yt-dlp/wiki/PO-Token-Guide) van yt-dlp.

## Boty

Boty is een eenvoudige Discord Bot met verschillende basisfuncties zoals moderatie, memevoting en muziekchannels.

## Todo

- Tests
- ... laat maar weten

## Bijdragen

Je bent altijd welkom een issue/PR te maken als je suggesties hebt of fouten vindt.
