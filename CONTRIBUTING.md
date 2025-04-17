# Contributing

Please follow guidelines defined in this file to contribute.
Make sure your code is documented and passes all tests before submitting a Pull Request (PR).

## Create a Pull Request (PR)


#### 1. Create a new branch
To avoid directly modifying the main branch, you should create a new branch where you'll make your changes.
```bash
git checkout -b feature/my-new-feature
```
#### 2. Make Changes and Commit
Make the necessary code changes or fixes. After editing the files, you need to commit the changes.

#### 3. Push Changes to GitHub
Use `git push` to push commits made on your local branch to a remote repository.   

```bash
git push REMOTE-NAME BRANCH-NAME
```

#### 4. Create a PR on GitHub
Since there are multiple packages in the repository, please specify the name of the package in the title of the PR.  
for example,  

```bash
webos-javascript: Summary of the changes you made.
```

Every pull request should contain the following:
   - documentation in the code
   - test
   - changelog entry. See below for more information on how to create a changeset entry.


## Changeset
ChangeSet is a library for maintaining consistency and easy deployment of easily interdependent packages in a monorepo environment. Whenever a package is updated, version control is done according to the Semver rules.
See below for how to do it.

#### 1. Generate a Changeset
After making changes to your code, you can create a new changeset by running:  
```bash
npx changeset
```

When you run this command, it starts an interactive prompt that will ask you a few questions about the changes you've made. This process allows you to record the changes in a structured format.

#### 2. Answer the Interactive Prompts
- Which packages are affected?   
  You will be asked to select which packages in your monorepo were modified. You can use the spacebar to select multiple packages if necessary.
- What type of change is this? (major, minor, patch)  
  Next, you'll be asked what type of version bump you want to apply to the affected packages. The choices are:
  - major: For breaking changes
  - minor: For new features that are backward-compatible
  - patch: For bug fixes and minor improvements
- Which packages are affected?  
  Finally, you'll provide a brief summary of the changes. This is a description of what was done in the code and why it's being updated.

#### 3. Check the generated Changeset File
After you've answered the prompts, a new file is created inside the changesets folder in your project. The file will be named with a unique identifier (like a timestamp) and will have the following structure:

```yaml
---
"package1": minor
"package2": patch
---
Add new feature to package1 and package2
```
**note)**
If there are any changes to the loctool-webos plugin,  
a changeset should be created to reflect the updates in the `ilib-loctool-webos-dist` as well.

#### 4. Commit the Changeset File
After the changeset file is created, you need to commit it to Git:

```bash
git add .
git commit -m "Add changeset for package1 and package2"
```
This ensures that the changeset is both tracked and included in your version control history.