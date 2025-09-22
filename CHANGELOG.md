# Changelog

## 2025-09-21

Changes released on 2025-09-21.

### Fixed

- Disqus: single `#disqus_thread` container from dispatcher; provider handles embed/fallback only. Verified locally under JEKYLL_ENV=production with JS test. (refs #27)

## 2025-09-21

Changes released on 2025-09-21.

### Fixed

- Disqus: removed hard-coded “Leave a Comment” heading from dispatcher; provider include now controls heading and fallback. (refs #27)

## 2025-09-19

### Added

- New post: “Modernizing an Old Jekyll Blog with GitHub Actions and AI” (published to staging).
- Header image (typewriter → laptop) and caption set; excerpt added to front matter.

### Changed

- Staging SEO: enabled `noindex` via `_config_gh_pages.yml` and `<meta name="robots" …>` in the head.
- Canonicals on staging now point to production domain via `canonical_base`.

### Fixed

- `robots.txt` now blocks staging (`Disallow: /`) and allows production.

### Removed

- Sidebar link to Twitter/X.

### Docs/Meta

- Issue template (`todo.yml`): auto-assigns @kyleskrinak; standardized “TODO: …” titles.
- Labeled and assigned open tasks; normalized titles on #23 and #24 (“TODO: …”).
- New TODOs: responsive images investigation; audit for root-relative links.

## 2025-09-10

### Changed

- Upgrade Reveal.js to 5.2 and migrate layouts to ESM imports.
- Keep `reveal.js-menu` pinned at 2.1; documented rationale and rollback notes.
- Mark `assets/reveal/**` as vendored in `.gitattributes`.

### Fixed

- Parity between `reveal.html` and `reveal-duke.html`: working custom **Links** panel.
- CI: refined proofer scripts and staging workflow.

## 2025-09-09

### FEAT

- feat: Sort comments by date ascending (#3184)

### FIX

- fix: change heading tag of related posts section from `h4` to `h2` for SEO enhancement (#3064)

### CHORE

- chore(templates): add To-Do issue template and PR template

### Other

- Squash: consolidate changes from 8ddd698..b1481e4
- remove OIDC output logging in GH Actions
- CI/CD & hosting: html-proofer 5.x, subset checks, GH Pages→Actions, S3+CloudFront (OAC), trust policy fix, misc cleanup
- update prod deployment script
- security: remove plaintext email; use GitHub private vulnerability reporting only security: remove plaintext email; use GitHub private vulnerability reporting only getting ready for ci-cd pipeline ci: add staging Pages workflow (with htmlproofer) and production AWS deploy workflow tweaking github settings for pipelines build: bump Ruby to 3.2.9 and update lockfile build: bump Ruby to 3.2.9 and update lockfile build: add x86_64-linux platform to Gemfile.lock for CI CI: htmlproofer v5 — drop --config and rely on .htmlproofer.yml auto-load Staging: set site.url to GH Pages; proofer url_swap for same-host absolute links proofer: use url_ignore + url_swap; ignore bot-hostile domains proofer(v5): scope url_ignore/url_swap under Links; ignore bot-hostile domains and 301/302/429/999 ci(staging): relax html-proofer for bot-hostile externals via CLI flags ci(staging): fix html-proofer CLI invocation; ignore flaky externals ci(staging): fix html-proofer flag; keep external ignores staging: jekyll build + internal-only html checks + deploy to GH Pages
- Use include for Reveal menu (Option A); link hygiene; repo cleanup
- WIP: move new changes to staging
- corrects tags and categories in prep for migration into hugo
- adding changes that fixed moms image missing
- updates shell-quote npm library
- updates webrick due to vulnerability
- graphics updates and minor text tweaks
- repeat caption removed
- updates to the lowcarb page
- minor content update
- removed docs directive
- Bump minimatch from 3.0.4 to 3.1.2
- moving site output to docs
- Improve PR close auto-comment message (#3713)
- updates nav to include index.html
- Bump shell-quote from 1.7.1 to 1.7.3
- moving to Gilead
- Update CHANGELOG and history
- Fix #3668 breaking "disable per-page when globally enabled" (#3669)
- Update CHANGELOG and history
- Remove IE9 upgrade notice (#3666)
- Fix #3096 enabling breadcrumb on all pages (#3668)
- Update CHANGELOG and history
- Replace with public YouTube video embeds
- Replace with public YouTube video
- Update CHANGELOG and history
- Update algolia-search-scripts.html (#3102)
- Make it possible to enable breadcrumbs per page (#3096)
- Update CHANGELOG and history
- Update link to Font Awesome gallery (#3599)
- Update CHANGELOG and history
- Update attribution link (#3553)
- Update
- Add Kiswahili translation (#3489)
- Exclude `main.scss` from Lunr search index
- Update CHANGELOG and history
- add optinal lunr searching of pages (#3352)
- Update CHANGELOG and history
- fix typo about loading javascript in footer (#3350)
- Update CHANGELOG and history
- Update to Jquery 3.6.0 (#3254)
- Update CHANGELOG and history
- Fix inline code style not applied to stylized text (#3253)
- Update CHANGELOG and history
- Use <a> color for blockquote.notice border (#3140)
- Update CHANGELOG and history
- Added sameAs (#3087)
- adds new Drupal WOHD presentation
- more minor changes
- Isabels edits
- minor change to reference slide
- ready to submit to Drupalcon
- added graphics, more changes from Isabel
- minor slide changes
- add qr code to contact info on home page
- incorporates Isabels changes
- moving draft to online
- fleshed out early first draft, finally
- added notes functionality, continued slide drafting
- continued presentation drafting
- updates reveal, continued work on DrupalCon presentation
- adding content to DC 22 presentation
- updates reveal, title
- updating staging branch before pulling in from source
- Store changes before a reboot
- Update CHANGELOG and history
- Automatically close invalid PRs using GitHub Actions (#3313)
- merge upstream changes, removed fitbit story
- updates to reveal js lib
- Update CHANGELOG and history
- Add missing comma (#3318)
- Update CHANGELOG and history
- ✏ fix typo (#3232)
- Update CHANGELOG and history
- Fix keybase class (#3221)
- Update CHANGELOG and history
- Update CHANGELOG and history
- Update Brazilian Portuguese translation (#3204)
- Link clarifying adding plugins (#3181)
- Making verbiage consistent w/current _config.yml (#3180)
- Fix broken link & Add Baidu site verification (#3139)
- Added optional label attribute (#3128)
- Delete stale.yml
- Delete stale.yml
- changes tts to tcas in slide
- updates after changing my lowcarb URL
- Use GitHub issue templates (#3133)
- menu change
- removed other call to path-parse
- update lchf page
- minor changes
- Update CHANGELOG and history
- include video does not survive compress.html (#3117)
- Update CHANGELOG and history
- Bump path-parse from 1.0.6 to 1.0.7
- Remove extra semi-colon
- Update CHANGELOG and history
- Enable magnific popup on <a> tags only when it has <img> (#3114)
- Update CHANGELOG and history
- Added Danish translations (#3095)
- Update CHANGELOG and history
- Add role to search (#3086)
- Add margin around Google ads
- Update CHANGELOG and history
- Enable sticky toc on test post
- Enable toc sidebar scrolling (#2874)
- Update CHANGELOG and history
- Add Microformats (#3052)
- Update 01-quick-start-guide.md
- Make small grammar changes
- Update CHANGELOG and history
- Add instructions on how to unminify main.js for easier browser debugging (#3055)
- Update CHANGELOG and history
- Update CHANGELOG and history
- Fixed a grammar error in the german translation (#3063)
- Update CHANGELOG and history
- Remove site.url from first breadcrumb link (#3051)
- Update version
- reveal lib update
- new post on jekyll for simple sites
- adding ruby config updates before switching to staging for a theme update.
- loose shorts and tsa
- finished gratitude post
- more general edits to latest post
- adds the Holly adoption story
- reduced starry night image
- updating main action to only run on master updates
- moved fb migration text into an includes
- removed shinleaf from front page listing
- more changes, adding shinleaf campsite story
- ready to publish
- updates to karens story
- migrating stories from fb to this blog
- new kingston fire post added, unfinished
- significant revision of my main lchf page.
- rearranging tags and categories, including new menu options
- previewing new page before uploading
- oops, left important file out.
- new post on Hugo
- maybe only need one, not three, directive for jekyll-actions
- adding config build options all three calls
- bad syntax in main.yml actions file the build options is not passing to gh build process trying by setting baseurl in config.yml instead to / failed to update url correctlyand baseurl shuffling config options around again, rerolling a space in the config build options is a syntax no-no adding a second input in the main.yml file for the config options to pass for building so close, perhaps the slash for baseurl is superflous?
- trying new build option for gh pages
- Create the main.yml file to test building website
- updates to include jekyll-gzip
- updates to support updates after cleaning gem subsystem
- minor update to our TAG presentation
- minor change to content
- presentation update
- adds new presy
- removed reveal menu .git dir
- updates theme, reveal, adds menu link to presentation
- updates for Namma
- using the og-image setting
- update config change
- update presentation file
- updated drupal training minutes
- capture repo updates before updating intro training doc
- updates reveal.js and adds an exclude rsync file
- moved files into WSL2 container, updated ruby version
- adds Moms eulogy
- adds new fitbit post
- prepping for low-carb alternatives
- adding new blog post before beginning the next one
- published new post
- saving changes before updating
- profile management slide deck, location changes
- OOH presetnation for tomorrow
- calendar correction after O365 fix
- calendar update
- adding resources prior to commit
- one last change
- ready to present
- first draft of my DC2019-HES presentation
- removed docs and tests from upstream
- updates reveal to 3.8.0
- adds updates to video notes page, htaccess
- adds gzip, htaccess instructions for gzip, updates videos watched
- minor text changes to see if there are any upstream updates.
- updates location info
- updated my before and after photo
- updating repo with live commit before upstream update
- new article on clothing
- added reveal layout, nearly successfully
- minor updates
- posted my win10 config info
- draft updates
- new drafts for win10 config and dr phinney
- adds and corrects issues with favicons across devices
- updates with fresh theme
- Create README.md
- Update CHANGELOG and history

## Unreleased

### Bug Fixes

- Fix unlisted YouTube video embeds in documentation/test sites. [#3649](https://github.com/mmistakes/minimal-mistakes/issues/3649)
- Fix error in Algolia search script when returning a hit that without `html` and `hightlight.html`. [#3101](https://github.com/mmistakes/minimal-mistakes/issues/3101) [#3102](https://github.com/mmistakes/minimal-mistakes/pull/3102)
- Fix links to Font Awesome gallery. [#3599](https://github.com/mmistakes/minimal-mistakes/pull/3599)
- Fix GreedyNav.js attribution link. [#3553](https://github.com/mmistakes/minimal-mistakes/pull/3553)
- Fix typo about loading JavaScript in layout documentation. [#3350](https://github.com/mmistakes/minimal-mistakes/pull/3350)
- Fix inline code style not applied to stylized text. [#3253](https://github.com/mmistakes/minimal-mistakes/pull/3253)
- Fix documentation typos. [#3232](https://github.com/mmistakes/minimal-mistakes/pull/3232) [#3318](https://github.com/mmistakes/minimal-mistakes/pull/3318)
- Fix Keybase icon in author sidebar. [#3221](https://github.com/mmistakes/minimal-mistakes/pull/3221)
- Fix sort order of Staticman comments when data files aren't named alphabetically. [#3184](https://github.com/mmistakes/minimal-mistakes/pull/3184)
- Fix `layout: compress` issue with HTML comment in video include. [#3117](https://github.com/mmistakes/minimal-mistakes/pull/3117)
- Add Magnific Popup class to anchors that only contain an `img` element. [#3111](https://github.com/mmistakes/minimal-mistakes/issues/3111) [#3114](https://github.com/mmistakes/minimal-mistakes/pull/3114)
- Enable Magnific Popups on anchors only when they wrap an `<img>` element. [#3114](https://github.com/mmistakes/minimal-mistakes/pull/3114)
- Fix heading level of related posts section from `h4` to `h2` to improve accessibility and SEO. [#3064](https://github.com/mmistakes/minimal-mistakes/pull/3064)
- Fix grammar error in German localized UI text string. [#3063](https://github.com/mmistakes/minimal-mistakes/pull/3063)
- Remove site.url from first breadcrumb link. [#3051](https://github.com/mmistakes/minimal-mistakes/pull/3051)

### Enhancements

- Update breadcrumbs conditional to enable/disable them via Front Matter on pages using `layout: single`. [#3096](https://github.com/mmistakes/minimal-mistakes/pull/3096) [#3669](https://github.com/mmistakes/minimal-mistakes/pull/3669)
- Remove Internet Explorer 9 upgrade notice. [#3666](https://github.com/mmistakes/minimal-mistakes/pull/3666)
- Add Kiswahili localized UI text strings. [#3489](https://github.com/mmistakes/minimal-mistakes/pull/3489)
- Exclude `main.scss` from Lunr search index.
- Allow `site.pages` to be indexed and searched via Lunr. [#3352](https://github.com/mmistakes/minimal-mistakes/pull/3352)
- Update jQuery to v3.6.0. [#3254](https://github.com/mmistakes/minimal-mistakes/pull/3254)
- Use notice `<a>` colors for blockquotes that have `notice--` classes applied. [#3140](https://github.com/mmistakes/minimal-mistakes/pull/3140) [#3068](https://github.com/mmistakes/minimal-mistakes/issues/3068)
- Add sameAs itemprop to author link. [#3087](https://github.com/mmistakes/minimal-mistakes/pull/3087)
- Automatically close invalid PRs using GitHub Actions. [#3313](https://github.com/mmistakes/minimal-mistakes/pull/3313)
- Update and add missing Brazilian Portuguese translations. [#3204](https://github.com/mmistakes/minimal-mistakes/pull/3204)
- Add link to documentation clarifying how to add plugins. [#3181](https://github.com/mmistakes/minimal-mistakes/pull/3181)
- Add optional label attribute for utterances comments. [#3128](https://github.com/mmistakes/minimal-mistakes/pull/3128)
- Bump path-parse from 1.0.6 to 1.0.7. [#3116](https://github.com/mmistakes/minimal-mistakes/pull/3116)
- Add missing Danish translations. [#3095](https://github.com/mmistakes/minimal-mistakes/pull/3095)
- Add ARIA role to search forms. [#3086](https://github.com/mmistakes/minimal-mistakes/pull/3086)
- Add overflow scroll bar to sticky table of contents that are taller than the viewport's height. [#2874](https://github.com/mmistakes/minimal-mistakes/pull/2874)
- Add Microformats markup. [#3052](https://github.com/mmistakes/minimal-mistakes/pull/3052)
- Add instructions on how to unminify `main.js` for easier browser debugging. [#3055](https://github.com/mmistakes/minimal-mistakes/pull/3055)

### Removed Minimal Mistakes previous changelog