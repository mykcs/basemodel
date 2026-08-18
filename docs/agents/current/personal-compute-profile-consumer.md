# Public lab topology privacy boundary

Last reviewed: **2026-08-14**

Status: **the former personal-device runtime profile is retired from Base Model before public release.**

## Public-source rule

Base Model may document a reusable research-compute topology, but it must not publish or dynamically load the owner's personal device inventory or private lab profile.

The public `/lab/` and `/en/lab/` routes may explain only generic concepts such as:

- an Internet-connected control workstation;
- an approved access boundary;
- an internal compute host or cluster;
- keeping credentials and private network details outside Git;
- separating scientifically relevant compute constraints from identifying infrastructure metadata.

## Forbidden public details

Do not add or mirror:

- personal device names or model inventory unless independently required by a published experiment;
- private profile endpoints or cross-repository device feeds;
- IP addresses, hostnames, usernames, serial numbers, MAC addresses or physical lab location;
- SSH keys, passwords, credentials, access tokens, VPN endpoints or share/access query parameters;
- port-forwarding instructions that expose an internal host publicly;
- time-sensitive observations that identify the owner's private network or account setup.

If a paper or experiment requires hardware disclosure, publish the minimum scientifically relevant aggregate specification rather than the owner's broader personal-device topology.

## Agent rule

When a task concerns lab connectivity or compute setup, begin from the generic public topology in this repository. User-specific infrastructure belongs in private context or a private repository and must not be copied into Base Model.

A future Agent must not reconnect the former personal profile feed merely because historical PRs or commits mention it. History is evidence of prior design, not permission to republish private infrastructure.

## Change checklist

1. Keep `/lab/` generic and non-identifying.
2. Keep secrets and provider/account identifiers outside source control.
3. Add only the minimum hardware facts needed for a reproducible public experiment.
4. Run the Public Release Security Gate before changing repository visibility.
