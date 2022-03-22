---
layout: reveal-duke
title: Drupal Multisite on a Dime
excerpt: or How we Adopted CI/CD for TCA&S’s Drupal Multisite Hosting for Trinity’s
  100 Drupal websites
permalink: "/presentations/20-12-04-drupal-multisite.html"
header:
  og_image: "/assets/images/doublenickelsonthedime.jpg"
comments: false
date: 2020-12-03 15:21 -0500
---
{::nomarkdown}


# Drupal Multisite on a Dime
## or How we Adopted CI/CD for TCA&S’s Drupal Multisite Hosting for Trinity’s 100+ Drupal websites

----

#### This presentation:
https://bit.ly/tcas-drupal-multisite



# Your presenter

----

## Kyle Skrinak, I.T. Manager
### Trinity College of Arts & Sciences
Web Support (now part of OIT), Duke University
https://people.duke.edu/~kds38



# Meet the team

----

* David Palmer, *DevOps*
* Andy Smith, *Web Dev & Design*
* Gabe Fahl, *PHP Programmer*
* Alex Verhoeven, *Web Dev & Design*
* John Herr, *PHP Programmer*



# Who We Serve?

----

* Trinity College of Arts & Sciences departments, administrative, labs, etc.
  * 120 active websites
  * 100+ legacy websites and web applications
* SLAs and MoUs, *including*
  * divinity.duke.edu
  * dibs.duke.edu
  * sanford.duke.edu



# Requirements

----

* Consistency across all of our websites
* Rely on Open Source community, and not custom module development
* Decreased support and discovery time
* Greatly agility with code updates, website maintenance, and deployment
* Minimize cost for external tools



# Overview: Timeline

----

* 2013: Apostrophe → Drupal migration starts
* 2014: Drupal Multi-site *(hosting, version control)*
* 2015: Base + Sub theme *(branding, gitorius → gitlab)*
* 2016: FDS → Scholars migration *(profile data, membership)*
* 2017: Drupal 8 distribution begins, first D8 website (A→D7 migration ends)
* 2018: D8 requirements set (hosting, branding, membership)
* 2019: D8 distribution starts, production begins (CI/CD deployed)
* 2020: Currently at 27 D8 websites



# Innovations

----

* 2014: Drupal Multi-site
  * Pantheon discussions and debate over multi-site
  * The DevOps-like dashboard for managing websites
* 2015: Drupal Omega Base + Sub theme <!-- .element: class="fragment" -->
  * Simplified enforcing our branding across n number of websites
  * Reduced complexity of our support by providing reasonable defaults for content migration



# Innovations

----

* 2016: Department profile management
  * The "People" section of our websites
  * Faculty Database System (FDS) → Scholars effort  <!-- .element: class="fragment" -->
  * Missing: non-faculty membership and our TCA&S-wide directory on trinity.duke.edu  <!-- .element: class="fragment" -->
  * Support for Duke's system of record  <!-- .element: class="fragment" -->
  * Solution: design and implement middleware <!-- .element: class="fragment" -->
    * Directory Tool
    * Plenty of Feeds



# Drupal 8: Design phase

----

* Finished D7 website migration by 2017
* Goal setting  <!-- .element: class="fragment" -->
  * Enforce feature and content denormalization  <!-- .element: class="fragment" -->
  * Continue to lean on community, not custom modules  <!-- .element: class="fragment" -->
  * Confirm: multi-site <!-- .element: class="fragment" -->
  * Configuration management <!-- .element: class="fragment" -->
  * Exploit DevOps tools: Composer, CI/CD <!-- .element: class="fragment" -->



# DevOps becomes a real thing

----

* You've got developers in my sysadmins?
* You've got sysadmins in my developers?

> Mmmm! It's good!



# Our CI/CD Pipeline

| Site tasks                  | Pushbuttons         | Revert      | Migrate         |
|-----------------------------|---------------------|-------------|-----------------|
| Enable maintenance mode     | Production backsync | Restore DB  | Staging to Prod |
| DB Backup                   | Git pull \<branch\> | Revert code |                 |
| Git Reset --hard \<branch\> |                     |             |                 |
| Drush entity update         |                     |             |                 |
| Drush clear caches          |                     |             |                 |
| Apache OpCache clear        |                     |             |                 |
| Drush config export         |                     |             |                 |
| Drush config import         |                     |             |                 |
| Fix permissions             |                     |             |                 |
| Disable maintenance mode    |                     |             |                 |
| Backsync DB from prod       |                     |             |                 |



# Our Current Workflow

----

* Continue to enhance our content editorial experience
* Weekly meetings with the TCA&S Comm team
* Tamp down scope creep as we scale
* Synchronize core features and display across all websites
* Extend our CI/CD to WordPress and other servers
* In process: default site content



# Q & A

----

> *thank you*
{:/}
