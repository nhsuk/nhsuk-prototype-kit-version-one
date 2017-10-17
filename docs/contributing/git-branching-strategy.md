# Git branching strategy
**Author**: Steven Adams  
**Date**: 9/10/17  

For the nhsuk-prototype-kit repo we use the [MasterFlow branching strategy](https://medium.com/kainos/masterflow-simple-git-branching-e9b6844d64af). Branch names must conform to the following naming convention, where branch-type can be `feature` or `hotfix-[release-being-hotfixed]`:

`[branch-type]/[JIRA-ticket-id]-short-and-descriptive-branch-name`

**Example**:
`feature/NDPE-18-clear-stored-location-information`

## Creating a release
A release is created by tagging the current head of master with the major/minor release number e.g v2.1.

> During the normal release tagging process your patch version should always be excluded or set to 0 e.g. v2.1 or v2.1.0.

## Hotfixes
A hotfix of a release can come in two forms, critical and non-critical. Non-critical hotfixes are issues that need fixed but are not considered show stoppers and can wait until the next scheduled release. Critical hotfixes are issues considered to be more urgent that justify a new "patched" release being published independently of the next release.

In either case (critical or non-critical) create a branch:

**Example**:
`git checkout -b hotfix-v2.1/NDPE-24-hotfix-for-button-ui`

Then make your changes and commit. Once the hotfix is complete, push your hotfix branch to origin, tag it with the relevant patch number (in the above example v2.1.1) and submit a merge request to master.
