# Contribution to course-reviews

It is essential that you know how to use Git as well as GitHub. While the maintainers will be more than happy helping you make your first PR, prerequisite know-how makes it easier for everyone involved. Check [this](https://github.com/firstcontributions/first-contributions) guide if you've never contributed to a project on GitHub before.

Please note we have a [Code of Conduct](CONDUCT.md). Please follow it in all your interactions with the project.

When you submit code changes, your submissions are understood to be under the same GNU-GPL v3 License that covers the project. Feel free to contact the maintainers if that's a concern.

## Contribution Workflow

1. Fork the repo from GitHub
2. Clone the fork locally
3. Setup a remote to the upstream ( `git remote add upstream https://github.com/crux-bphc/crux-forum-backend.git` )
4. Create a new branch for the feature you are working on ( `git checkout -b branch-name` )
5. Develop on `new-branch`
6. Commit your changes to the `new-branch`. ( `git commit -am "Descriptive Commit Message"` )
7. Update local dev to match upstream's dev ( `git fetch upstream dev`)
8. Merge with local dev ( ` git checkout dev; git merge upstream/dev` )
9. Rebase `new-branch` ( `git checkout new-branch; git rebase dev`)
10. Push your branch to GitHub ( `git push origin new-branch` )
11. Go to GitHub and submit a Pull Request to dev branch

## Pull Request Guidelines

1. Try to limit the number of commits per PR to 1. If the changes are diverse enough to be put in 2 different commits, consider submitting 2 different PRs instead. (If there is no option but to submit multi commit PR's, please talk to the maintainers beforehand and read the section on multi commit PR's)
2. When submitting a PR, follow the PR template and make sure to complete all the steps in the PR checklist in the PR template. (You will be able to see the template when you are submitting a new PR).
3. 4 automated checks are run whenever a PR is submitted. Make sure Your PR can pass all of these checks. (Read further for details)
4. Code Style Checks - 2 code style checks run for every PR, using ESLint and Prettier. It is considered good practice to run these tools locally and ensure your code meets our style guidelines before submitting a PR
5. Unit Test Checks - Unit Tests are run for every submitted PR. This test also checks for code coverage. Any PR, irrespective of how important it is, will be rejected if it fails to meet the required 75% code coverage thershold
6. Build Checks - The application is build and a smoke test is conducted to see if the application responds for every submitted PR.

## Multi-Commit PRs

**Note**: This section has concepts that may be too advanced for new Git users. It is recommended that such contributors
ask for help from those more experienced.

Sometimes a PR will require or endup with more than one commit. There are two possibilities of this happening:

- Additional granularity that each commit provides to a feature branch. An example of this is when you make big
  changes to the UI to follow a new set of guidelines or standard. In such a case, it may be beneficial to have separate
  commits for each fragment/activity that is changed.

- New commits pushed after a review from the maintainer(s). New commits are recommended over amending existing commit(s)
  and force pushing since the latter would make your changes a lot harder to review.

Note that in both cases, only a single PR is required. It is the PR that will have multiple commits. In both cases, our
concern is the additional commits that are added to a PR to fix problems found during code review.

Consider the case of a PR with two commits, `A` and `B`. After a code review, let two additional commits `C` and `D` be
created to fix problems found in `A` and `B` respectively. It might be beneficial to have both `A` and `B` as individual
commits after merging them into `development`, instead of squashing all of them into a single commit. However, a simple
rebase of the PR would include `A`, `B`, `C`, and `D` in `development`. This reduces the readability of the `development`
branch's history.

A possibility would be to makes the necessary changes, stage them, and then do `git commit --amend` to amend `B`. We can
then force push the changes. However, this is not ideal for two reasons: `B` now has changes that were supposed to fix
`A`, and we force pushed.

Ideally, we would like to squash `C` and `D` into `A` and `B` respectively. This can be accomplished by doing an
interactive rebase using `git rebase -i HEAD~4`, reordering the commits in the todo list, and then squashing them
together. However, this process is tedious.

Git allows us to automatically squash or fixup such commits. Git does this by editing the todo list for us when we
perform an interactive rebase. Assume we want to automatically squash `C` into `A`, and `D` into `B`. This can be
accomplished as follows:

1. Stage the changes to be committed. These changes will form commit `C`.
2. Perform `git commit --fixup ...`. Here `...` is either the commit hash, or commit subject of `A`. This will create
   commit `C` with the subject as `!fixup ...`. This annotation tells Git which commit `C` will _fixup_.
3. Repeat the above steps to create `D`.
4. Perform `git rebase -i --autosquash HEAD~4`. Use the annotations in the commit subjects, Git will generate a todo list
   such that `C` and `D` will fixup `A` and `B` respectively.
5. Continue with the rebase and fix any merge problems you encounter.

Note that `fixup` can be replaced with `squash` in the above steps as well. However, the option `--autosquash` for
`git rebase` will remain the same for both cases.

For the sake of completeness, the difference between fixup and squash is as follows:

> When `C` fixes up `A`, the changes of `C` is applied to `A` and the commit message of `C` is discarded and only that of
> `A` is used in the new commit.

> When `C` is squashed with `A`, the changes of `C` is applied to `A` and the user is prompted to provide a new commit
> message for the squashed commit.

For further reading, [here][auto-squash-doc] is the documentation for `--autosquash`.

[auto-squash-doc]: https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---autosquash
