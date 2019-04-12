import cdk = require('@aws-cdk/cdk');
import ssm = require('@aws-cdk/aws-ssm');
import { PdfConverter } from './pdf-converter';

export class CdkGithubMd2pdfStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tokenParameterName = '/GitHubToken/rix0rrr';

    new PdfConverter(this, 'Converter', {
      owner: 'rix0rrr',
      repository: 'rix0rrr.github.com',
      commitUsername: 'PDFBot',
      commitEmail: 'pdfbot@felienne.com',
      options: {
        "listings-disable-line-numbers": "true"
      }
    });
  }
}
