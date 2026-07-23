# Trip Maintenance

Trip is one of the owner's private split-repos projects, deployed through GitHub
Pages on push to `main`.

## Verification

- Never open the deployed site, a browser preview, or live URLs to verify. the owner
  confirms production behavior.
- Review source and run the repo's tests / typecheck / build before publishing.

## GitHub Publish

- Every feature or fix request is a request to ship it: implement, verify, commit,
  and push to `main` in the same session — never leave finished work undeployed or
  waiting for a separate "deploy" ask. The push runs `.github/workflows/deploy-pages.yml`.
- Commits and pushes must come from the currently logged-in GitHub user (verify
  with `gh api user`); never invent or switch identity.
- Never add AI co-author trailers, `Co-authored-by:` lines, or AI/Cursor/Codex
  taglines. Keep commit messages clean and human.
- Do not force-push to `main` or overwrite unrelated user changes.

## Privacy

- These repositories deploy publicly. Never write the owner's real name, personal
  email, home location, or other personal/sensitive details into committed files
  (source, docs, AGENTS.md, CLAUDE.md) or commit messages. Refer to "the owner"
  generically; the GitHub commit identity is the only owner reference that belongs
  in the repo.
