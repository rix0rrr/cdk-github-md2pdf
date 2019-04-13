# github-md2pdf

Convert MarkDown to PDF in a GitHub repository.

## Installation

### GitHub Token

Create a GitHub Personal Access Token with scopes **repo** and **admin:repo_hook**, and import it into CodeBuild. You need to be admin on the project you want to create this on:

```
aws codebuild import-source-credentials --server-type GITHUB --auth-type PERSONAL_ACCESS_TOKEN --token <token_value>
```

Also write it to a Systems Manager Parameter:

```
aws --profile persoonlijk ssm put-parameter --type String --name /GitHubToken/rix0rrr --value <token>
```

## MarkDown Format

You probably want to add front matter to the MarkDown document:

## Eisvogel

Uses [Eisvogel](https://github.com/Wandmalfarbe/pandoc-latex-template), thanks
to that project and see the other project for options to add to your project.