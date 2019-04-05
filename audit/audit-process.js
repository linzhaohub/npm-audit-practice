const fs = require("fs");
const shell = require("shelljs");
const _ = require("lodash");

const report = require("./report.json");
const advisoryURL = "https://npmjs.com/advisories/";

const advisories = report["advisories"];

const findings = _.flatten(
  Object.keys(advisories).map(advisoryKey => {
    const advisoryFindings = advisories[advisoryKey].findings;
    const refine = advisoryFindings.filter(find => {
      find["advisoryId"] = advisoryKey;
      find["url"] = `${advisoryURL}${advisoryKey}`;
      return find.dev === false;
    });
    return refine;
  })
);

if (findings.length > 0) {
  shell.echo(
    `found ${
      findings.length
    } vulnerabilities among production dependencies. Please visit below link for details`
  );
  shell.echo("--------------------");
  findings.forEach(find => {
    shell.echo(`URL: ${find.url}`);
    shell.echo(`Path: ${find.paths.join(" | ")}`);
    shell.echo("--------------------");
  });
  shell.exec("rm -rf report.json");
  shell.exit(1);
} else {
  shell.exec("rm -rf report.json");
  shell.exit(0);
}
// searching for dev=false

// exit code 0 if not find or 1 if find dev=false

// brief report if find dev=false
