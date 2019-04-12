import cdk = require('@aws-cdk/cdk');
import codebuild = require('@aws-cdk/aws-codebuild');
import path = require('path');
import iam = require('@aws-cdk/aws-iam');

export interface PdfConverterProps {
  /**
   * GitHub repository owner
   */
  owner: string;

  /**
   * GitHub repository name
   */
  repository: string;

  /**
   * User name of commits added by bot
   */
  commitUsername: string;

  /**
   * Email address of commits added by bot
   */
  commitEmail: string;

  /**
   * User that is going to be authenticating to the repository for pushing
   *
   * @default owner
   */
  pushUser?: string;

  /**
   * AWS SSM Parameter Store name where personal access token is stored
   *
   * @default "/GitHubToken/$owner"
   */
  personalAccessTokenParameterName?: string;

  /**
   * Additional options to pass to the template
   */
  options?: {[key: string]: string};
}

export class PdfConverter extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: PdfConverterProps) {
    super(scope, id);

    const meta = Object.entries(props.options || {}).map(([k, v]) => `--metadata=${k}:${v}`).join(' ');

    const parameterName = props.personalAccessTokenParameterName || `/GitHubToken/${props.owner}`;

    const project = new codebuild.Project(this, 'UpdateProject', {
      description: 'Convert MarkDown to PDF in a GitHub repository',
      source: new codebuild.GitHubSource({
        owner: props.owner,
        repo: props.repository,
        oauthToken: cdk.SecretValue.plainText(''),
        webhook: true,
      }),
      environment: {
        computeType: codebuild.ComputeType.Small,
        buildImage: codebuild.LinuxBuildImage.fromAsset(this, 'Image', {
          directory: path.join(__dirname, '..', 'docker-image')
        })
      },
      buildSpec: {
        version: '0.2',
        env: {
          variables: {
            PUSH_USER: props.pushUser || props.owner,
            OWNER: props.owner,
            REPO: props.repository,
            METADATA: meta,
          },
          'parameter-store': {
            ACCESS_TOKEN: parameterName,
          },
        },
        phases: {
          pre_build: {
            commands: [
              `git config --global user.name "${props.commitUsername}"`,
              `git config --global user.email "${props.commitEmail}"`,
            ],
          },
          build: {
            commands: [
              'env',  // For debugging
              'convert-all-markdowns',
            ],
          }
        },
      },
    });

    project.addToRolePolicy(new iam.PolicyStatement()
      .addActions('ssm:GetParameter', 'ssm:GetParameters')
      .addResource(this.node.stack.formatArn({
        service: 'ssm',
        resource: 'parameter',
        resourceName: parameterName.replace(/^\//, ''), // Remove leading slash
      })));
  }
}