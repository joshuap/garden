const fs = require(`fs`);
const path = require(`path`);
const { urlResolve, createContentDigest } = require(`gatsby-core-utils`);
const slugify = require(`slugify`);
const {
  findTopLevelHeading,
} = require(`gatsby-transformer-markdown-references`);

// These are customizable theme options we only need to check once
let basePath;
let roamUrl;
let rootNote;
let extensions;
let mediaTypes;

exports.onPreBootstrap = async ({ store }) => {
  const { program } = store.getState();

  basePath = `/`;
  rootNote = `/September-9th-2020`;
  roamUrl = process.env.ROAM_URL;
  extensions = [".md", ".mdx"];
  mediaTypes = ["text/markdown", "text/x-markdown"];

  await copyFile(
    path.join(__dirname, "./fragments/roam.fragment"),
    `${program.directory}/.cache/fragments/garden-fragments.js`
  );
};

function getTitle(node, content) {
  if (
    typeof node.frontmatter === "object" &&
    node.frontmatter &&
    node.frontmatter["title"]
  ) {
    return node.frontmatter["title"];
  }
  return (
    findTopLevelHeading(content) ||
    (typeof node.fileAbsolutePath === "string"
      ? path.basename(
        node.fileAbsolutePath,
        path.extname(node.fileAbsolutePath)
      )
      : "") ||
    (typeof node.absolutePath === "string"
      ? path.basename(node.absolutePath, path.extname(node.absolutePath))
      : "")
  );
}

exports.onCreateNode = async ({ node, actions, loadNodeContent }, options) => {
  const { createNodeField } = actions;

  if (node.internal.type === `RoamPage` && node.sourceUrl === roamUrl) {
    createNodeField({
      node,
      name: `slug`,
      value: urlResolve(basePath, slugify(node.title)),
    });
  }
  if (node.internal.type === `RoamBlock` && node.sourceUrl === roamUrl) {
    if (!node.uid) {
      return;
    }
    createNodeField({
      node,
      name: `slug`,
      value: urlResolve(basePath, slugify(node.uid)),
    });
  }
};

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MdxFrontmatter: {
      private: {
        type: `Boolean`,
        resolve(source, args, context, info) {
          const { private } = source;
          if (private == null) {
            return false;
          }
          return private;
        },
      },
    },
  };
  createResolvers(resolvers);
};

async function copyFile(from, to) {
  return fs.promises.writeFile(to, await fs.promises.readFile(from));
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(
    `
      {
        allRoamPage {
          nodes {
            id
            sourceUrl
            fields {
              slug
            }
          }
        }
        allRoamBlock {
          nodes {
            id
            sourceUrl
            fields {
              slug
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    console.log(result.errors);
    throw new Error(`Could not query Roam`, result.errors);
  }

  const RoamBlockTemplate = require.resolve(`./src/templates/roam-block`);
  const RoamPageTemplate = require.resolve(`./src/templates/roam-page`);

  const roamBlocks = result.data.allRoamBlock.nodes.filter(
    (node) => node.sourceUrl === roamUrl
  );

  roamBlocks.forEach((node) =>
    createPage({
      path: node.fields.slug,
      component: RoamBlockTemplate,
      context: {
        id: node.id,
      },
    })
  );

  const roamPages = result.data.allRoamPage.nodes.filter(
    (node) => node.sourceUrl === roamUrl
  );

  roamPages.forEach((node) =>
    createPage({
      path: node.fields.slug,
      component: RoamPageTemplate,
      context: {
        id: node.id,
      },
    })
  );

  if (rootNote) {
    const root = roamPages.find((node) => node.fields.slug === rootNote);
    if (root) {
      createPage({
        path: basePath,
        component: RoamPageTemplate,
        context: {
          id: root.id,
        },
      });
    }
  }
};