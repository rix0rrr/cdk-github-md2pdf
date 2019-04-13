#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { CdkGithubMd2pdfStack } from '../lib/cdk-github-md2pdf-stack';

const app = new cdk.App();
new CdkGithubMd2pdfStack(app, 'GitHubPdfConverters');
